import dayjs from 'dayjs/esm';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import weekday from 'dayjs/esm/plugin/weekday';
import localeData from 'dayjs/esm/plugin/localeData';
import weekOfYear from 'dayjs/esm/plugin/weekOfYear';
import weekYear from 'dayjs/esm/plugin/weekYear';

// Configure plugins
dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export default dayjs; 