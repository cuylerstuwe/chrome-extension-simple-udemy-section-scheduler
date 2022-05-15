let config = {};

config = {
    SHOULD_PRINT_DEBUG_LOGS: (process.env.NODE_ENV !== "production"),
};

module.exports = config;