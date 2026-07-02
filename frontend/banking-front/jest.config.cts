module.exports = {
  displayName: 'banking-front',
  preset: './jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: './coverage/banking-front',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testMatch: [
    '<rootDir>/src/app/app.spec.ts',
    '<rootDir>/src/app/core/guards/auth.guard.spec.ts',
    '<rootDir>/src/app/core/services/auth/auth.service.spec.ts',
    '<rootDir>/src/app/layout/content/content.component.spec.ts',
    '<rootDir>/src/app/layout/content/components/header/header.component.spec.ts',
    '<rootDir>/src/app/layout/content/components/footer/footer.component.spec.ts',
    '<rootDir>/src/app/layout/content/components/side-bar/side-bar.component.spec.ts',
    '<rootDir>/src/app/pages/clients/clients.component.spec.ts',
    '<rootDir>/src/app/shared/ui/button/button.component.spec.ts',
    '<rootDir>/src/app/shared/ui/data-table/data-table.component.spec.ts',
    '<rootDir>/src/app/shared/ui/paginator/paginator.component.spec.ts',
  ],
  coverageReporters: ['html', 'lcov', 'text-summary'],
};
