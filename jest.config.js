module.exports = {
    roots: ["<rootDir>/src"],
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/index..{js,jsx,ts,tsx}",
        "!src/**/*.d.ts"
    ],
    setupFiles: [
        "react-app-polyfill/jsdom"
    ],
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
        "<rootDir>/src/**/*.{spec,test,steps}.{js,jsx,ts,tsx}"
    ],
    testEnvironment: "jest-environment-jsdom-fourteen",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
        "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    transformIgnorePatterns: [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
        "^.+\\.module\\.(css|sass|scss)$"
    ],
    modulePaths: [],
    moduleNameMapper: {
        "^react-native$": "react-native-web",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    moduleFileExtensions: ["web.js", "js", "web.ts", "ts", "web.tsx", "tsx", "json", "web.jsx", "jsx", "node"],
    watchPlugins: [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname"
    ],
    verbose: false,
    reporters: [
        "default",
        [
            "jest-stare",
            {
                "resultDir": "jest-report",
                "reportTitle": "Project Test Report",
                "additionalResultsProcessors": ["jest-junit"],
                "coverageLink": "../coverage/lcov-report/index.html",
                "jestStareConfigJson": "jest-stare.json",
                "jestGlobalConfigJson": "globalStuff.json"
            }
        ]
    ]
};