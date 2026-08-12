<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * These tests verify the dependency upgrade performed in composer.json /
 * composer.lock (Laravel 11 -> 12 and spatie/laravel-query-builder 5 -> 6).
 *
 * They operate directly on the JSON files rather than the installed
 * `vendor/` directory so that they remain fast, deterministic and do not
 * require a full `composer install` to run.
 */
class ComposerDependenciesTest extends TestCase
{
    private array $composerJson;

    private array $composerLock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->composerJson = json_decode(
            file_get_contents(__DIR__.'/../../composer.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        $this->composerLock = json_decode(
            file_get_contents(__DIR__.'/../../composer.lock'),
            true,
            512,
            JSON_THROW_ON_ERROR
        );
    }

    private function findLockedPackage(string $name): ?array
    {
        foreach ($this->composerLock['packages'] ?? [] as $package) {
            if ($package['name'] === $name) {
                return $package;
            }
        }

        return null;
    }

    /**
     * Minimal caret ("^x.y") constraint check against a locked version
     * string (which may be prefixed with a "v", e.g. "v12.65.0").
     */
    private function assertSatisfiesCaretMajor(string $constraint, string $version, string $message = ''): void
    {
        $this->assertMatchesRegularExpression('/^\^\d+(\.\d+)*$/', $constraint, "Constraint [$constraint] is not a simple caret constraint.");

        $constraintMajor = (int) explode('.', ltrim($constraint, '^'))[0];
        $versionMajor = (int) explode('.', ltrim($version, 'v'))[0];

        $this->assertSame($constraintMajor, $versionMajor, $message ?: "Version [$version] does not satisfy caret constraint [$constraint].");
    }

    // -----------------------------------------------------------------
    // composer.json: declared constraints
    // -----------------------------------------------------------------

    public function test_composer_json_requires_laravel_framework_version_12(): void
    {
        $this->assertSame('^12.0', $this->composerJson['require']['laravel/framework']);
    }

    public function test_composer_json_no_longer_requires_laravel_framework_version_11(): void
    {
        $this->assertNotSame('^11.0', $this->composerJson['require']['laravel/framework']);
    }

    public function test_composer_json_requires_spatie_query_builder_version_6(): void
    {
        $this->assertSame('^6.0', $this->composerJson['require']['spatie/laravel-query-builder']);
    }

    public function test_composer_json_no_longer_requires_spatie_query_builder_version_5(): void
    {
        $this->assertNotSame('^5.7', $this->composerJson['require']['spatie/laravel-query-builder']);
    }

    public function test_composer_json_php_constraint_is_unchanged_by_the_upgrade(): void
    {
        $this->assertSame('^8.2', $this->composerJson['require']['php']);
    }

    public function test_composer_json_unrelated_direct_dependencies_are_untouched(): void
    {
        $this->assertSame('^4.0', $this->composerJson['require']['laravel/sanctum']);
        $this->assertSame('^2.9', $this->composerJson['require']['laravel/tinker']);
        $this->assertSame('^4.23', $this->composerJson['require']['spatie/laravel-data']);
    }

    // -----------------------------------------------------------------
    // composer.lock: content-hash bookkeeping
    // -----------------------------------------------------------------

    public function test_composer_lock_content_hash_matches_the_upgraded_composer_json(): void
    {
        $this->assertSame('9a352c5869ea0b8bb38fa8e5c8e78e56', $this->composerLock['content-hash']);
    }

    public function test_composer_lock_content_hash_is_a_valid_md5_hash(): void
    {
        $this->assertMatchesRegularExpression('/^[a-f0-9]{32}$/', $this->composerLock['content-hash']);
    }

    public function test_composer_lock_platform_php_constraint_matches_composer_json(): void
    {
        $this->assertSame($this->composerJson['require']['php'], $this->composerLock['platform']['php']);
    }

    // -----------------------------------------------------------------
    // composer.lock: laravel/framework
    // -----------------------------------------------------------------

    public function test_laravel_framework_is_locked_to_a_v12_release(): void
    {
        $package = $this->findLockedPackage('laravel/framework');

        $this->assertNotNull($package, 'laravel/framework package not found in composer.lock');
        $this->assertStringStartsWith('v12.', $package['version']);
        $this->assertSatisfiesCaretMajor($this->composerJson['require']['laravel/framework'], $package['version']);
    }

    public function test_laravel_framework_is_not_locked_to_the_previous_v11_release(): void
    {
        $package = $this->findLockedPackage('laravel/framework');

        $this->assertNotNull($package);
        $this->assertFalse(str_starts_with($package['version'], 'v11.'));
    }

    public function test_laravel_framework_requires_updated_symfony_seven_two_components(): void
    {
        $package = $this->findLockedPackage('laravel/framework');
        $require = $package['require'];

        foreach ([
            'symfony/console',
            'symfony/error-handler',
            'symfony/finder',
            'symfony/http-foundation',
            'symfony/http-kernel',
            'symfony/mailer',
            'symfony/mime',
            'symfony/process',
            'symfony/routing',
            'symfony/uid',
            'symfony/var-dumper',
        ] as $component) {
            $this->assertSame('^7.2.0', $require[$component], "Expected {$component} to require ^7.2.0");
        }
    }

    public function test_laravel_framework_requires_new_php84_and_php85_polyfills(): void
    {
        $require = $this->findLockedPackage('laravel/framework')['require'];

        $this->assertArrayHasKey('symfony/polyfill-php84', $require);
        $this->assertSame('^1.34', $require['symfony/polyfill-php84']);

        $this->assertArrayHasKey('symfony/polyfill-php85', $require);
        $this->assertSame('^1.34', $require['symfony/polyfill-php85']);

        $this->assertSame('^1.33', $require['symfony/polyfill-php83']);
    }

    public function test_laravel_framework_narrows_the_brick_math_constraint(): void
    {
        $require = $this->findLockedPackage('laravel/framework')['require'];

        $this->assertSame('^0.11|^0.12|^0.13|^0.14', $require['brick/math']);
        $this->assertStringNotContainsString('0.9.3', $require['brick/math']);
        $this->assertStringNotContainsString('0.10.2', $require['brick/math']);
    }

    public function test_laravel_framework_requires_laravel_prompts_three(): void
    {
        $require = $this->findLockedPackage('laravel/framework')['require'];

        $this->assertSame('^0.3.0', $require['laravel/prompts']);
    }

    public function test_laravel_framework_replace_section_includes_the_new_illuminate_packages(): void
    {
        $replace = $this->findLockedPackage('laravel/framework')['replace'];

        $this->assertArrayHasKey('illuminate/json-schema', $replace);
        $this->assertSame('self.version', $replace['illuminate/json-schema']);

        $this->assertArrayHasKey('illuminate/reflection', $replace);
        $this->assertSame('self.version', $replace['illuminate/reflection']);
    }

    public function test_laravel_framework_autoload_includes_the_new_reflection_component(): void
    {
        $autoload = $this->findLockedPackage('laravel/framework')['autoload'];

        $this->assertContains('src/Illuminate/Reflection/helpers.php', $autoload['files']);
        $this->assertContains('src/Illuminate/Reflection/', $autoload['psr-4']['Illuminate\\Support\\']);
    }

    public function test_laravel_framework_dev_tooling_versions_were_bumped(): void
    {
        $requireDev = $this->findLockedPackage('laravel/framework')['require-dev'];

        $this->assertSame('^10.9.0', $requireDev['orchestra/testbench-core']);
        $this->assertSame('^2.1.41', $requireDev['phpstan/phpstan']);
        $this->assertSame('^7.2.0', $requireDev['symfony/cache']);
    }

    // -----------------------------------------------------------------
    // composer.lock: spatie/laravel-query-builder
    // -----------------------------------------------------------------

    public function test_spatie_query_builder_is_locked_to_a_major_version_6_release(): void
    {
        $package = $this->findLockedPackage('spatie/laravel-query-builder');

        $this->assertNotNull($package, 'spatie/laravel-query-builder package not found in composer.lock');
        $this->assertStringStartsWith('6.', $package['version']);
        $this->assertSatisfiesCaretMajor($this->composerJson['require']['spatie/laravel-query-builder'], $package['version']);
    }

    public function test_spatie_query_builder_is_not_locked_to_the_previous_major_version_5(): void
    {
        $package = $this->findLockedPackage('spatie/laravel-query-builder');

        $this->assertNotNull($package);
        $this->assertNotSame('5.8.1', $package['version']);
        $this->assertFalse(str_starts_with($package['version'], '5.'));
    }

    public function test_spatie_query_builder_supports_laravel_12_and_13(): void
    {
        $require = $this->findLockedPackage('spatie/laravel-query-builder')['require'];

        $this->assertStringContainsString('^12.0', $require['illuminate/database']);
        $this->assertStringContainsString('^13.0', $require['illuminate/database']);
        $this->assertStringContainsString('^12.0', $require['illuminate/http']);
        $this->assertStringContainsString('^12.0', $require['illuminate/support']);
    }

    public function test_spatie_query_builder_still_registers_its_service_provider(): void
    {
        $package = $this->findLockedPackage('spatie/laravel-query-builder');

        $this->assertSame(
            ['Spatie\\QueryBuilder\\QueryBuilderServiceProvider'],
            $package['extra']['laravel']['providers']
        );
    }

    // -----------------------------------------------------------------
    // composer.lock: transitive new dependency
    // -----------------------------------------------------------------

    public function test_symfony_polyfill_php84_was_added_as_a_locked_package(): void
    {
        $package = $this->findLockedPackage('symfony/polyfill-php84');

        $this->assertNotNull($package, 'symfony/polyfill-php84 should be a new locked package for Laravel 12.');
        $this->assertArrayHasKey('bootstrap.php', array_flip($package['autoload']['files']));
        $this->assertArrayHasKey('Symfony\\Polyfill\\Php84\\', $package['autoload']['psr-4']);
    }
}