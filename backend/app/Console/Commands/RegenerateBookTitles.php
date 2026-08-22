<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RegenerateBookTitles extends Command
{
    protected $signature = 'books:regenerate-titles {--chunk=500}';
    protected $description = 'Regenerates book titles using a wider word pool to reduce duplicate titles';

    protected array $adjectives = [
        'Ancient', 'Golden', 'Silent', 'Hidden', 'Broken', 'Crimson', 'Eternal',
        'Forgotten', 'Whispering', 'Wandering', 'Rising', 'Falling', 'Endless',
        'Distant', 'Quiet', 'Secret', 'Shadow', 'Northern', 'First', 'Last',
        'Lonely', 'Burning', 'Frozen', 'Restless', 'Sacred', 'Vanishing',
        'Scarlet', 'Midnight', 'Radiant', 'Weathered', 'Bitter', 'Gentle',
        'Savage', 'Timeless', 'Fading', 'Roaring', 'Velvet', 'Silver',
        'Amber', 'Iron', 'Marble', 'Painted', 'Unspoken', 'Drifting', 'Stormy',
    ];

    protected array $nouns = [
        'Voyage', 'Storm', 'City', 'River', 'Star', 'House', 'Legacy',
        'Ocean', 'Horizon', 'Symphony', 'Winter', 'Path', 'Kingdom', 'Letter',
        'Mountain', 'Garden', 'Shore', 'Forest', 'Journey', 'Promise',
        'Harbor', 'Valley', 'Bridge', 'Tower', 'Island', 'Meadow', 'Canyon',
        'Library', 'Orchard', 'Lighthouse', 'Village', 'Cathedral', 'Market',
        'Chronicle', 'Testament', 'Empire', 'Rebellion', 'Covenant', 'Reckoning',
        'Inheritance', 'Awakening', 'Pilgrimage', 'Sanctuary', 'Threshold', 'Vow',
    ];

    protected array $templates = [
        'The {adj} {noun}',
        'The {noun} of {adj2}',
        '{adj} {noun}',
    ];

    public function handle(): int
    {
        $chunkSize = (int) $this->option('chunk');
        $total = DB::table('books_master')->count();

        if ($total === 0) {
            $this->info('No books found.');
            return self::SUCCESS;
        }

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        DB::table('books_master')
            ->orderBy('book_code')
            ->select('book_code')
            ->chunkById($chunkSize, function ($rows) use ($bar) {
                $whenSql = [];
                $whenBindings = [];
                $codes = [];

                foreach ($rows as $row) {
                    $title = $this->generateTitle();
                    $whenSql[] = 'WHEN ? THEN ?';
                    $whenBindings[] = $row->book_code;
                    $whenBindings[] = $title;
                    $codes[] = $row->book_code;
                }

                $placeholders = implode(',', array_fill(0, count($codes), '?'));
                $caseSql = implode(' ', $whenSql);

                DB::update(
                    "UPDATE books_master
                     SET title = CASE book_code {$caseSql} ELSE title END,
                         updated_at = NOW()
                     WHERE book_code IN ({$placeholders})",
                    [...$whenBindings, ...$codes]
                );

                $bar->advance($rows->count());
            }, 'book_code');

        $bar->finish();
        $this->newLine();
        $this->info('Done. Titles regenerated with a wider word pool.');

        return self::SUCCESS;
    }

    protected function generateTitle(): string
    {
        $template = $this->templates[array_rand($this->templates)];
        $adj = $this->adjectives[array_rand($this->adjectives)];
        $adj2 = $this->adjectives[array_rand($this->adjectives)];
        $noun = $this->nouns[array_rand($this->nouns)];

        return strtr($template, [
            '{adj}' => $adj,
            '{adj2}' => $adj2,
            '{noun}' => $noun,
        ]);
    }
}
