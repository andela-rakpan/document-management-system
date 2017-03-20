
/**
 * Helpers class for Controllers
 */
class ControllerHelper {

  /**
   * Resets the database models
   * @param {integer} limit
   * @param {integer} offset
   * @param {integer} count
   * @return {Object} - Returns Pagination Result
   */
  static pagination(limit, offset, count) {
    // totalCount : total number of records based on query
    // pageCount : total number of pages
    // currentPage : current page of the query result based on limit and offset
    // pageSize : number of records per page (based on limit)
    const result = {};
    limit = limit > count ? count : limit;
    offset = offset > count ? count : offset;
    result.totalCount = count;
    result.currentPage = Math.floor(offset / limit) + 1;
    result.pageCount = Math.ceil(count / limit);
    result.pageSize = Number(limit);
    if (result.currentPage === result.pageCount && offset !== 0) {
      result.pageSize = result.totalCount % offset === 0 ?
        result.totalCount - offset : result.totalCount % offset;
      result.pageSize = Number(result.pageSize);
    }
    return result;
  }
}

export default ControllerHelper;
