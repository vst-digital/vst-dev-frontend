import DateFnsUtils from "@date-io/date-fns";

import {DATE_FORMAT, DATE_TIME_FORMAT_12_HR, DATE_TIME_FORMAT_24_HR} from "shared/utilities/constant";

class LocalizedDateFnsUtils extends DateFnsUtils {
    constructor() {
        super();
        this.dateFormat = DATE_FORMAT;
        this.dateTime12hFormat = DATE_TIME_FORMAT_12_HR;
        this.dateTime24hFormat = DATE_TIME_FORMAT_24_HR;
    }
}

export default LocalizedDateFnsUtils;
