const paginateArray = (array, pageNumber, limit) => {
    const start = (pageNumber - 1) * limit;
    const end = start + limit;
    return array.slice(start, end);
}

module.exports = {
    paginateArray
}