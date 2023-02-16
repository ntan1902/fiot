module.exports = {
    generateJson(type, key, value, json) {
        let jsonValue
        if (type === "string") {
            jsonValue = String(value)
        } else if (type === "float" || type === "double" || type === "integer" || type === "long") {
            jsonValue = Number(value)
        } else if (type === "boolean") {
            jsonValue = Boolean(value)
        }
        json[key] = jsonValue

        return json
    },

    getKeyValueTags(key, value) {
        const keyTags = key.match(/\${[${A-Za-z0-9.^\]\[*_]*}/g) || []
        const valueTags = value.match(/\${[${A-Za-z0-9.^\]\[*_]*}/g) || []

        return {
            keyTags: keyTags.map((keyTag) => keyTag.replace(/\${|}/g, "")),
            valueTags: valueTags.map((valueTag) => valueTag.replace(/\${|}/g, "")),
        }
    },

    convert(str, data) {
        let result = str;
        let tags = str.match(/\${[${A-Za-z0-9.^\]\[*_]*}/g) || []

        if (tags.length > 0) {
            tags = tags.map(tag => tag.replace(/\${|}/g, ""))
            tags.forEach(tag => {
                result = result.replace("${" + tag + "}", data[tag])
            })
        }

        return result
    },

    hasJsonStructure(str) {
        if (typeof str !== "string") return false

        try {
            const result = JSON.parse(str)
            const type = Object.prototype.toString.call(result)
            return type === "[object Object]" || type === "[object Array]"
        } catch (err) {
            return false
        }
    }

}