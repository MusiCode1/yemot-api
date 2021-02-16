module.exports = { ini_from_obj };

function ini_from_obj(obj) {

    let arr = [];

    for (const i of Object.entries(obj)) {
        arr.push(i.join("="));
    }

    return arr.join("\n");
}