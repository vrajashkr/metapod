const getValuefromJSON = (source, keyArray) => {
    let value = source;
    for (let i = 0; i < keyArray.length; i++){
        value = value[keyArray[i]]
    }
    return value;
}

export default getValuefromJSON;