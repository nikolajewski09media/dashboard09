
require('dotenv').config();

const at = {
    domain: process.env.AT_DOMAIN,
    propertyV4: process.env.AT_PROPERTY_V4,
    gewerk: process.env.AT_GEWERK,
    unterGewerk: process.env.AT_UNTER_GEWERK
}

module.exports = { at };