/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <ctime>
#include <list>
#include <memory>
#include <string>
#include <json/reader.h>
#include <json/writer.h>
#include <sys/slog2.h>
#include <unicode/calendar.h>
#include <unicode/datefmt.h>
#include <unicode/decimfmt.h>
#include <unicode/dtfmtsym.h>
#include <unicode/smpdtfmt.h>
#include "globalization_ndk.hpp"
#include "globalization_js.hpp"

/*
 * The following constants are defined based on Cordova Globalization
 * plugin definition. They should match exactly.
 * https://github.com/apache/cordova-plugin-globalization/blob/master/doc/index.md
*/
const int UNKNOWN_ERROR = 0;
const int FORMATTING_ERROR = 1;
const int PARSING_ERROR = 2;
const int PATTERN_ERROR = 3;

namespace webworks {

std::string errorInJson(int code, const std::string& message)
{
    Json::Value error;
    error["code"] = code;
    error["message"] = message;

    Json::Value root;
    root["error"] = error;

    Json::FastWriter writer;
    return writer.write(root);
}

std::string resultInJson(const std::string& value)
{
    Json::Value root;
    root["result"] = value;

    Json::FastWriter writer;
    return writer.write(root);
}

// This is needed so resultInJson(const char*) will not be called into
// resultInJson(bool) implicitly.
static inline std::string resultInJson(const char* value)
{
    return resultInJson(std::string(value));
}

std::string resultInJson(bool value)
{
    Json::Value root;
    root["result"] = value;

    Json::FastWriter writer;
    return writer.write(root);
}

std::string resultInJson(int value)
{
    Json::Value root;
    root["result"] = value;

    Json::FastWriter writer;
    return writer.write(root);
}

std::string resultInJson(double value)
{
    Json::Value root;
    root["result"] = value;

    Json::FastWriter writer;
    return writer.write(root);
}

std::string resultDateInJson(const UDate& date)
{
    UErrorCode status = U_ZERO_ERROR;
    Calendar* cal = Calendar::createInstance(status);
    if (!cal) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::resultInJson: failed to create Calendar instance: %d",
                status);
        return errorInJson(UNKNOWN_ERROR, "Failed to create Calendar instance!");
    }
    std::auto_ptr<Calendar> deleter(cal);

    cal->setTime(date, status);
    if (status != U_ZERO_ERROR && status != U_ERROR_WARNING_START) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::resultInJson: failed to setTime: %d",
                status);
        return errorInJson(UNKNOWN_ERROR, "Failed to set Calendar time!");
    }

    Json::Value result;
    result["year"] = cal->get(UCAL_YEAR, status);
    result["month"] = cal->get(UCAL_MONTH, status);
    result["day"] = cal->get(UCAL_DAY_OF_MONTH, status);
    result["hour"] = cal->get(UCAL_HOUR, status);
    result["minute"] = cal->get(UCAL_MINUTE, status);
    result["second"] = cal->get(UCAL_SECOND, status);
    result["millisecond"] = cal->get(UCAL_MILLISECOND, status);

    Json::Value root;
    root["result"] = result;

    Json::FastWriter writer;
    return writer.write(root);
}

std::string resultInJson(const std::string& pattern, const std::string& timezone, int utc_offset, int dst_offset)
{
    Json::Value result;
    result["pattern"] = pattern;
    result["timezone"] = timezone;
    result["utc_offset"] = utc_offset;
    result["dst_offset"] = dst_offset;

    Json::Value root;
    root["result"] = result;

    Json::FastWriter writer;
    return writer.write(root);
}

std::string resultInJson(const std::string& pattern, const std::string& symbol, int fraction,
        double rounding, const std::string& positive, const std::string& negative,
        const std::string& decimal, const std::string& grouping)
{
    Json::Value result;
    result["pattern"] = pattern;
    result["symbol"] = symbol;
    result["fraction"] = fraction;
    result["rounding"] = rounding;
    result["positive"] = positive;
    result["negative"] = negative;
    result["decimal"] = decimal;
    result["grouping"] = grouping;

    Json::Value root;
    root["result"] = result;

    Json::FastWriter writer;
    return writer.write(root);
}

std::string resultInJson(const std::string& pattern, const std::string& code,
        int fraction, double rounding,
        const std::string& decimal, const std::string& grouping)
{
    Json::Value result;
    result["pattern"] = pattern;
    result["code"] = code;
    result["fraction"] = fraction;
    result["rounding"] = rounding;
    result["decimal"] = decimal;
    result["grouping"] = grouping;

    Json::Value root;
    root["result"] = result;

    Json::FastWriter writer;
    return writer.write(root);
}

std::string resultInJson(const std::list<std::string>& names)
{
    Json::Value result;
    std::list<std::string>::const_iterator end = names.end();
    std::list<std::string>::const_iterator iter = names.begin();
    for (; iter != end; ++iter)
        result.append(*iter);

    Json::Value root;
    root["result"] = result;

    Json::FastWriter writer;
    return writer.write(root);
}


GlobalizationNDK::GlobalizationNDK(GlobalizationJS *parent) {
	m_pParent = parent;
}

GlobalizationNDK::~GlobalizationNDK() {
}

std::string GlobalizationNDK::getPreferredLanguage()
{
    const Locale& loc = Locale::getDefault();

    UnicodeString disp;
    loc.getDisplayLanguage(loc, disp);
    if (disp.isEmpty())
        return resultInJson("English"); // FIXME: what should be the default language?

    std::string utf8;
    disp.toUTF8String(utf8);
    return resultInJson(utf8);
}

std::string GlobalizationNDK::getLocaleName()
{
    const Locale& loc = Locale::getDefault();
    const char* name = loc.getName();
    if (name)
        return resultInJson(name);

    const char* lang = loc.getLanguage();
    if (!lang)
        return resultInJson("en"); // FIXME: what should be the default language?

    const char* country = loc.getCountry();
    if (!country)
        return resultInJson(lang);

    return resultInJson(std::string(lang) + "_" + country);
}

static bool handleDateOptions(const Json::Value& options, DateFormat::EStyle& dateStyle, DateFormat::EStyle& timeStyle, std::string& error)
{
    // This is the default value when no options provided.
    dateStyle = DateFormat::kShort;
    timeStyle = DateFormat::kShort;

    if (options.isNull())
        return true;

    if (!options.isObject()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleDateOptions: invalid options format: %d",
                options.type());
        error = "Options is invalid!";
        return false;
    }

    Json::Value flv = options["formatLength"];
    if (!flv.isNull()) {
        if (!flv.isString()) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleDateOptions: invalid formatLength format: %d",
                    flv.type());
            error = "formatLength is invalid!";
            return false;
        }

        std::string format = flv.asString();
        if (format.empty()) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleDateOptions: empty formatLength!");
            error = "formatLength is empty!";
            return false;
        }

        if (format == "full") {
            dateStyle = DateFormat::kFull;
            timeStyle = dateStyle;
        } else if (format == "long") {
            dateStyle = DateFormat::kLong;
            timeStyle = dateStyle;
        } else if (format == "medium") {
            dateStyle = DateFormat::kMedium;
            timeStyle = dateStyle;
        } else if (format == "short") {
            // Nothing to change here.
        } else {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleDateOptions: unsupported formatLength: %s",
                    format.c_str());
            error = "Unsupported formatLength!";
            return false;
        }
    }

    Json::Value slv = options["selector"];
    if (!slv.isNull()) {
        if (!slv.isString()) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleDateOptions: invalid selector format: %d",
                    slv.type());
            error = "selector is invalid!";
            return false;
        }

        std::string selector = slv.asString();
        if (selector.empty()) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleDateOptions: empty selector!");
            error = "selector is empty!";
            return false;
        }

        if (selector == "date")
            timeStyle = DateFormat::kNone;
            // Nothing to change here
        else if (selector == "time")
            dateStyle = DateFormat::kNone;
        else if (selector == "date and time") {
            // Nothing to do here.
        } else {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleDateOptions: unsupported selector: %s",
                    selector.c_str());
            error = "Unsupported selector!";
            return false;
        }
    }

    return true;
}

std::string GlobalizationNDK::dateToString(const std::string& args)
{
    if (args.empty())
        return errorInJson(PARSING_ERROR, "No date provided!");

    Json::Reader reader;
    Json::Value root;
    bool parse = reader.parse(args, root);

    if (!parse) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::dateToString: invalid json data: %s",
                args.c_str());
        return errorInJson(PARSING_ERROR, "Parameters not valid json format!");
    }

    Json::Value date = root["date"];
    if (date.isNull()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::dateToString: no date provided.");
        return errorInJson(PARSING_ERROR, "No date provided!");
    }

    if (!date.isDouble()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::dateToString: date is not a Double: %d.",
                date.type());
        return errorInJson(PARSING_ERROR, "Date in wrong format!");
    }

    Json::Value options = root["options"];

    DateFormat::EStyle dstyle, tstyle;
    std::string error;

    if (!handleDateOptions(options, dstyle, tstyle, error))
        return errorInJson(PARSING_ERROR, error);

    UErrorCode status = U_ZERO_ERROR;
    const Locale& loc = Locale::getDefault();
    DateFormat* df = DateFormat::createDateTimeInstance(dstyle, tstyle, loc);

    if (!df) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::dateToString: unable to create DateFormat!");
        return errorInJson(UNKNOWN_ERROR, "Unable to create DateFormat instance!");
    }
    std::auto_ptr<DateFormat> deleter(df);

    UnicodeString result;
    df->format(date.asDouble(), result);

    std::string utf8;
    result.toUTF8String(utf8);
    return resultInJson(utf8);
}

std::string GlobalizationNDK::stringToDate(const std::string& args)
{
    if (args.empty())
        return errorInJson(PARSING_ERROR, "No dateString provided!");

    Json::Reader reader;
    Json::Value root;
    bool parse = reader.parse(args, root);

    if (!parse) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToDate: invalid json data: %s",
                args.c_str());
        return errorInJson(PARSING_ERROR, "Parameters not valid json format!");
    }

    Json::Value dateString = root["dateString"];
    if (!dateString.isString()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToDate: invalid dateString type: %d",
                dateString.type());
        return errorInJson(PARSING_ERROR, "dateString not a string!");
    }

    std::string dateValue = dateString.asString();
    if (dateValue.empty()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToDate: empty dateString.");
        return errorInJson(PARSING_ERROR, "dateString is empty!");
    }

    Json::Value options = root["options"];

    DateFormat::EStyle dstyle, tstyle;
    std::string error;
    if (!handleDateOptions(options, dstyle, tstyle, error))
        return errorInJson(PARSING_ERROR, error);

    const Locale& loc = Locale::getDefault();
    DateFormat* df = DateFormat::createDateTimeInstance(dstyle, tstyle, loc);

    if (!df) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToDate: unable to create DateFormat instance!");
        return errorInJson(UNKNOWN_ERROR, "Unable to create DateFormat instance!");
    }
    std::auto_ptr<DateFormat> deleter(df);

    UnicodeString uDate = UnicodeString::fromUTF8(dateValue);
    UErrorCode status = U_ZERO_ERROR;
    UDate date = df->parse(uDate, status);

    // Note: not sure why U_ERROR_WARNING_START is returned when parse succeeded.
    if (status != U_ZERO_ERROR && status != U_ERROR_WARNING_START) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToDate: DataFormat::parse error: %d: %s",
                status, dateValue.c_str());
        return errorInJson(PARSING_ERROR, "Failed to parse dateString!");
    }

    return resultDateInJson(date);
}

std::string GlobalizationNDK::getDatePattern(const std::string& args)
{
    DateFormat::EStyle dstyle = DateFormat::kShort, tstyle = DateFormat::kShort;

    if (!args.empty()) {
        Json::Reader reader;
        Json::Value root;
        bool parse = reader.parse(args, root);

        if (!parse) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getDatePattern: invalid json data: %s",
                    args.c_str());
            return errorInJson(PARSING_ERROR, "Parameters not valid json format!");
        }

        Json::Value options = root["options"];

        std::string error;
        if (!handleDateOptions(options, dstyle, tstyle, error))
            return errorInJson(PARSING_ERROR, error);
    }

    UErrorCode status = U_ZERO_ERROR;
    const Locale& loc = Locale::getDefault();
    DateFormat* df = DateFormat::createDateTimeInstance(dstyle, tstyle, loc);

    if (!df) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getDatePattern: unable to create DateFormat instance!");
        return errorInJson(UNKNOWN_ERROR, "Unable to create DateFormat instance!");
    }
    std::auto_ptr<DateFormat> deleter(df);

    if (df->getDynamicClassID() != SimpleDateFormat::getStaticClassID()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getDatePattern: DateFormat instance not SimpleDateFormat!");
        return errorInJson(UNKNOWN_ERROR, "DateFormat instance not SimpleDateFormat!");
    }

    SimpleDateFormat* sdf = (SimpleDateFormat*) df;

    UnicodeString pt;
    sdf->toPattern(pt);
    std::string ptUtf8;
    pt.toUTF8String(ptUtf8);

    const TimeZone& tz = sdf->getTimeZone();

    UnicodeString tzName;
    tz.getDisplayName(tzName);
    std::string tzUtf8;
    tzName.toUTF8String(tzUtf8);

    int utc_offset = tz.getRawOffset() / 1000; // UTC_OFFSET in seconds.
    int dst_offset = tz.getDSTSavings() / 1000; // DST_OFFSET in seconds;

    return resultInJson(ptUtf8, tzUtf8, utc_offset, dst_offset);
}

enum ENamesType {
    kNamesWide,
    kNamesNarrow,
    kNameWidthCount
};

enum ENamesItem {
    kNamesMonths,
    kNamesDays,
    kNamesTypeCount
};

static bool handleNamesOptions(const Json::Value& options, ENamesType& type, ENamesItem& item, std::string& error)
{
    // This is the default value when no options provided.
    type = kNamesWide;
    item = kNamesMonths;

    if (options.isNull())
        return true;

    if (!options.isObject()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNamesOptions: invalid options format: %d",
                options.type());
        error = "Options is invalid!";
        return false;
    }

    Json::Value tv = options["type"];
    if (!tv.isNull()) {
        if (!tv.isString()) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNamesOptions: invalid type format: %d",
                    tv.type());
            error = "type is invalid!";
            return false;
        }

        std::string tstr = tv.asString();
        if (tstr.empty()) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNamesOptions: empty type!");
            error = "type is empty!";
            return false;
        }

        if (tstr == "narrow") {
            type = kNamesNarrow;
        } else if (tstr == "wide") {
            // Nothing to change here.
        } else {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNamesOptions: unsupported type: %s",
                    tstr.c_str());
            error = "Unsupported type!";
            return false;
        }
    }

    Json::Value iv = options["item"];
    if (!iv.isNull()) {
        if (!iv.isString()) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNamesOptions: invalid item format: %d",
                    iv.type());
            error = "item is invalid!";
            return false;
        }

        std::string istr = iv.asString();
        if (istr.empty()) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNamesOptions: empty item!");
            error = "item is empty!";
            return false;
        }

        if (istr == "days") {
            item = kNamesDays;
        } else if (istr == "months") {
            // Nothing to change here.
        } else {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNamesOptions: unsupported item: %s",
                    istr.c_str());
            error = "Unsupported item!";
            return false;
        }
    }

    return true;
}

std::string GlobalizationNDK::getDateNames(const std::string& args)
{
    ENamesType type = kNamesWide;
    ENamesItem item = kNamesMonths;

    if (!args.empty()) {
        Json::Reader reader;
        Json::Value root;
        bool parse = reader.parse(args, root);

        if (!parse) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getDateNames: invalid json data: %s",
                    args.c_str());
            return errorInJson(PARSING_ERROR, "Parameters not valid json format!");
        }

        Json::Value options = root["options"];

        std::string error;
        if (!handleNamesOptions(options, type, item, error))
            return errorInJson(PARSING_ERROR, error);
    }

    int count;
    const char* pattern;
    DateFormat::EStyle dstyle;

    // Check ICU SimpleDateFormat document for patterns for months and days.
    // http://www.icu-project.org/apiref/icu4c/classicu_1_1SimpleDateFormat.html
    if (item == kNamesMonths) {
        count = 12;
        if (type == kNamesWide) {
            dstyle = DateFormat::kLong;
            pattern = "MMMM";
        } else {
            dstyle = DateFormat::kShort;
            pattern = "MMM";
        }
    } else {
        count = 7;
        if (type == kNamesWide) {
            dstyle = DateFormat::kLong;
            pattern = "eeee";
        } else {
            dstyle = DateFormat::kShort;
            pattern = "eee";
        }
    }

    UErrorCode status = U_ZERO_ERROR;
    const Locale& loc = Locale::getDefault();
    DateFormat* df = DateFormat::createDateInstance(dstyle, loc);

    if (!df) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getDateNames: unable to create DateFormat instance!");
        return errorInJson(UNKNOWN_ERROR, "Unable to create DateFormat instance!");
    }
    std::auto_ptr<DateFormat> deleter(df);

    if (df->getDynamicClassID() != SimpleDateFormat::getStaticClassID()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getDateNames: DateFormat instance not SimpleDateFormat!");
        return errorInJson(UNKNOWN_ERROR, "DateFormat instance not SimpleDateFormat!");
    }

    SimpleDateFormat* sdf = (SimpleDateFormat*) df;
    sdf->applyLocalizedPattern(UnicodeString(pattern, -1), status);

    Calendar* cal = Calendar::createInstance(status);
    if (!cal) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getDateNames: unable to create Calendar instance: %x.",
                status);
        return errorInJson(UNKNOWN_ERROR, "Unable to create Calendar instance!");
    }
    std::auto_ptr<Calendar> caldeleter(cal);

    UCalendarDaysOfWeek ud = cal->getFirstDayOfWeek(status);
    if (status != U_ZERO_ERROR && status != U_ERROR_WARNING_START) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getDateNames: failed to getFirstDayOfWeek: %d!",
                status);
        return errorInJson(PARSING_ERROR, "Failed to getFirstDayOfWeek!");
    }

    if (ud == UCAL_SUNDAY)
        cal->set(2014, 0, 5);
    else
        cal->set(2014, 0, 6);

    std::list<std::string> utf8Names;

    for (int i = 0; i < count; ++i) {
        UnicodeString ucs;
        sdf->format(cal->getTime(status), ucs);

        if (item == kNamesMonths)
            cal->add(UCAL_MONTH, 1, status);
        else
            cal->add(UCAL_DAY_OF_MONTH, 1, status);

        if (ucs.isEmpty())
            continue;

        std::string utf8;
        ucs.toUTF8String(utf8);
        utf8Names.push_back(utf8);
    }

    if (!utf8Names.size()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getDateNames: unable to get symbols: item: %d, type: %d.",
                item, type);
        return errorInJson(UNKNOWN_ERROR, "Unable to get symbols!");
    }

    return resultInJson(utf8Names);
}

std::string GlobalizationNDK::isDayLightSavingsTime(const std::string& args)
{
    if (args.empty()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::isDayLightSavingsTime: no date provided.");
        return errorInJson(UNKNOWN_ERROR, "No date is provided!");
    }

    Json::Reader reader;
    Json::Value root;
    bool parse = reader.parse(args, root);

    if (!parse) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::isDayLightSavingsTime: invalid json data: %s",
                args.c_str());
        return errorInJson(PARSING_ERROR, "Parameters not valid json format!");
    }

    Json::Value dv = root["date"];

    if (!dv.isNumeric()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::isDayLightSavingsTime: invalid date format: %d",
                dv.type());
        return errorInJson(PARSING_ERROR, "Invalid date format!");
    }

    double date = dv.asDouble();

    UErrorCode status = U_ZERO_ERROR;
    SimpleDateFormat* sdf = new SimpleDateFormat(status);
    if (!sdf) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::isDayLightSavingsTime: unable to create SimpleDateFormat instance: %d.",
                status);
        return errorInJson(UNKNOWN_ERROR, "Unable to create SimpleDateFormat instance!");
    }

    const TimeZone& tz = sdf->getTimeZone();
    bool result = tz.inDaylightTime(date, status);

    return resultInJson(result);
}

std::string GlobalizationNDK::getFirstDayOfWeek()
{
    UErrorCode status = U_ZERO_ERROR;
    Calendar* cal = Calendar::createInstance(status);
    if (!cal) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getFirstDayOfWeek: failed to create Calendar instance: %d",
                status);
        return errorInJson(UNKNOWN_ERROR, "Failed to create Calendar instance!");
    }

    UCalendarDaysOfWeek d = cal->getFirstDayOfWeek(status);
    if (status != U_ZERO_ERROR && status != U_ERROR_WARNING_START) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getFirstDayOfWeek: failed to call getFirstDayOfWeek: %d",
                status);
        return errorInJson(UNKNOWN_ERROR, "Failed to call getFirstDayOfWeek!");
    }

    return resultInJson(d);
}

enum ENumberType {
    kNumberDecimal,
    kNumberCurrency,
    kNumberPercent,
    kNumberTypeCount
};

static bool handleNumberOptions(const Json::Value& options, ENumberType& type, std::string& error)
{
    if (options.isNull())
        return true;

    if (!options.isObject()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNumberOptions: invalid options type: %d",
                options.type());
        error = "Invalid options type!";
        return false;
    }

    Json::Value tv = options["type"];
    if (tv.isNull()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNumberOptions: No type found!");
        error = "No type found!";
        return false;
    }

    if (!tv.isString()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNumberOptions: Invalid type type: %d",
                tv.type());
        error = "Invalid type type!";
        return false;
    }

    std::string tstr = tv.asString();
    if (tstr.empty()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNumberOptions: Empty type!");
        error = "Empty type!";
        return false;
    }

    if (tstr == "currency") {
        type = kNumberCurrency;
    } else if (tstr == "percent") {
        type = kNumberPercent;
    } else if (tstr == "decimal") {
        type = kNumberDecimal;
    } else {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::handleNumberOptions: unsupported type: %s",
                tstr.c_str());
        error = "Unsupported type!";
        return false;
    }

    return true;
}

std::string GlobalizationNDK::numberToString(const std::string& args)
{
    if (args.empty()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::numberToString: no arguments provided!");
        return errorInJson(UNKNOWN_ERROR, "No arguments provided!");
    }

    Json::Reader reader;
    Json::Value root;
    bool parse = reader.parse(args, root);

    if (!parse) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::numberToString: invalid json data: %s",
                args.c_str());
        return errorInJson(PARSING_ERROR, "Invalid json data!");
    }

    Json::Value nv = root["number"];
    if (nv.isNull()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::numberToString: no number provided!");
        return errorInJson(FORMATTING_ERROR, "No number provided!");
    }

    if (!nv.isNumeric()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::numberToString: invalid number type: %d!",
                nv.type());
        return errorInJson(FORMATTING_ERROR, "Invalid number type!");
    }

    // This is the default value when no options provided.
    ENumberType type = kNumberDecimal;

    Json::Value options = root["options"];
    std::string error;
    if (!handleNumberOptions(options, type, error))
        return errorInJson(PARSING_ERROR, error);

    UErrorCode status = U_ZERO_ERROR;
    NumberFormat* nf;
    switch (type) {
    case kNumberDecimal:
    default:
        nf = NumberFormat::createInstance(status);
        break;
    case kNumberCurrency:
        nf = NumberFormat::createCurrencyInstance(status);
        break;
    case kNumberPercent:
        nf = NumberFormat::createPercentInstance(status);
        break;
    }

    if (!nf) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::numberToString: failed to create NumberFormat instance for type %d: %d",
                status, type);
        return errorInJson(UNKNOWN_ERROR, "Failed to create NumberFormat instance!");
    }
    std::auto_ptr<NumberFormat> deleter(nf);

    UnicodeString result;
    nf->format(nv.asDouble(), result);
    std::string utf8;
    result.toUTF8String(utf8);

    return resultInJson(utf8);
}

std::string GlobalizationNDK::stringToNumber(const std::string& args)
{
    if (args.empty()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToNumber: no arguments provided!");
        return errorInJson(PARSING_ERROR, "No arguments provided!");
    }

    Json::Reader reader;
    Json::Value root;
    bool parse = reader.parse(args, root);

    if (!parse) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToNumber: invalid json data: %s",
                args.c_str());
        return errorInJson(PARSING_ERROR, "Invalid json data!");
    }

    Json::Value sv = root["numberString"];
    if (sv.isNull()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToNumber: no numberString provided!");
        return errorInJson(FORMATTING_ERROR, "No numberString provided!");
    }

    if (!sv.isString()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToNumber: invalid numberString type: %d!",
                sv.type());
        return errorInJson(FORMATTING_ERROR, "Invalid numberString type!");
    }

    std::string str = sv.asString();
    if (str.empty()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToNumber: empty numberString!");
        return errorInJson(FORMATTING_ERROR, "Empty numberString!");
    }

    // This is the default value when no options provided.
    ENumberType type = kNumberDecimal;

    Json::Value options = root["options"];
    std::string error;
    if (!handleNumberOptions(options, type, error))
        return errorInJson(PARSING_ERROR, error);

    UErrorCode status = U_ZERO_ERROR;
    NumberFormat* nf;
    switch (type) {
    case kNumberDecimal:
    default:
        nf = NumberFormat::createInstance(status);
        break;
    case kNumberCurrency:
        nf = NumberFormat::createCurrencyInstance(status);
        break;
    case kNumberPercent:
        nf = NumberFormat::createPercentInstance(status);
        break;
    }

    if (!nf) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToNumber: failed to create NumberFormat instance for type %d: %d",
                status, type);
        return errorInJson(UNKNOWN_ERROR, "Failed to create NumberFormat instance!");
    }
    std::auto_ptr<NumberFormat> deleter(nf);

    UnicodeString uStr = UnicodeString::fromUTF8(str);
    Formattable value;

    if (type == kNumberCurrency) {
         ParsePosition pos;
         CurrencyAmount* ca = nf->parseCurrency(uStr, pos);
         if (ca)
             value = ca->getNumber();
         else
             nf->parse(uStr, value, status);
    } else
        nf->parse(uStr, value, status);

    if (status != U_ZERO_ERROR && status != U_ERROR_WARNING_START) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToNumber: failed (%d) to parse string: %s",
                status, str.c_str());
        return errorInJson(PARSING_ERROR, "Failed to parse string!");
    }

    if (!value.isNumeric()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::stringToNumber: string is not numeric: %s",
                str.c_str());
        return errorInJson(FORMATTING_ERROR, "String is not numeric!");
    }

    return resultInJson(value.getDouble());
}

std::string GlobalizationNDK::getNumberPattern(const std::string& args)
{
    // This is the default value when no options provided.
    ENumberType type = kNumberDecimal;

    if (!args.empty()) {
        Json::Reader reader;
        Json::Value root;
        bool parse = reader.parse(args, root);

        if (!parse) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getNumberPattern: invalid json data: %s",
                    args.c_str());
            return errorInJson(PARSING_ERROR, "Invalid json data!");
        }

        Json::Value options = root["options"];
        std::string error;
        if (!handleNumberOptions(options, type, error))
            return errorInJson(PARSING_ERROR, error);
    }

    std::string pattern, symbol, positive, negative, decimal, grouping;
    int fraction;
    double rounding;

    UErrorCode status = U_ZERO_ERROR;
    NumberFormat* nf;
    switch (type) {
    case kNumberDecimal:
    default:
        nf = NumberFormat::createInstance(status);
        break;
    case kNumberCurrency:
        nf = NumberFormat::createCurrencyInstance(status);
        break;
    case kNumberPercent:
        nf = NumberFormat::createPercentInstance(status);
        break;
    }

    if (!nf) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getNumberPattern: failed to create NumberFormat instance for type %d: %d",
                status, type);
        return errorInJson(UNKNOWN_ERROR, "Failed to create NumberFormat instance!");
    }
    std::auto_ptr<NumberFormat> deleter(nf);

    if (nf->getDynamicClassID() != DecimalFormat::getStaticClassID()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getNumberPattern: DecimalFormat expected: %p != %p",
                nf->getDynamicClassID(), DecimalFormat::getStaticClassID());
        return errorInJson(UNKNOWN_ERROR, "DecimalFormat expected!");
    }

    DecimalFormat* df = (DecimalFormat*) nf;
    const DecimalFormatSymbols* dfs = df->getDecimalFormatSymbols();
    if (!dfs) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getNumberPattern: unable to get DecimalFormatSymbols!");
        return errorInJson(UNKNOWN_ERROR, "Failed to get DecimalFormatSymbols instance!");
    }

    UnicodeString ucs;

    df->toPattern(ucs);
    ucs.toUTF8String(pattern);
    ucs.remove();

    df->getPositivePrefix(ucs);
    if (ucs.isEmpty())
        df->getPositiveSuffix(ucs);
    ucs.toUTF8String(positive);
    ucs.remove();

    df->getNegativePrefix(ucs);
    if (ucs.isEmpty())
        df->getNegativeSuffix(ucs);
    ucs.toUTF8String(negative);
    ucs.remove();

    rounding = df->getRoundingIncrement();
    fraction = df->getMaximumFractionDigits();

    ucs = dfs->getSymbol(DecimalFormatSymbols::kDecimalSeparatorSymbol);
    ucs.toUTF8String(decimal);
    ucs.remove();

    ucs = dfs->getSymbol(DecimalFormatSymbols::kGroupingSeparatorSymbol);
    ucs.toUTF8String(grouping);
    ucs.remove();

    if (type == kNumberPercent)
        ucs = dfs->getSymbol(DecimalFormatSymbols::kPercentSymbol);
    else if (type == kNumberCurrency)
        ucs = dfs->getSymbol(DecimalFormatSymbols::kCurrencySymbol);
    else
        ucs = dfs->getSymbol(DecimalFormatSymbols::kDigitSymbol);

    ucs.toUTF8String(symbol);
    ucs.remove();

    return resultInJson(pattern, symbol, fraction, rounding, positive, negative, decimal, grouping);
}

std::string GlobalizationNDK::getCurrencyPattern(const std::string& args)
{
    if (args.empty()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getCurrencyPattern: no arguments provided!");
        return errorInJson(UNKNOWN_ERROR, "No arguments provided!");
    }

    Json::Reader reader;
    Json::Value root;
    bool parse = reader.parse(args, root);

    if (!parse) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getCurrencyPattern: invalid json data: %s",
                args.c_str());
        return errorInJson(PARSING_ERROR, "Invalid json data!");
    }

    Json::Value ccv = root["currencyCode"];
    if (ccv.isNull()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getCurrencyPattern: no currencyCode provided!");
        return errorInJson(FORMATTING_ERROR, "No currencyCode provided!");
    }

    if (!ccv.isString()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getCurrencyPattern: invalid currencyCode type: %d!",
                ccv.type());
        return errorInJson(FORMATTING_ERROR, "Invalid currencyCode type!");
    }

    std::string cc = ccv.asString();
    if (cc.empty()) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getCurrencyPattern: empty currencyCode!");
        return errorInJson(FORMATTING_ERROR, "Empty currencyCode!");
    }

    UnicodeString ucc = UnicodeString::fromUTF8(cc);
    DecimalFormat* df = 0;
    int count = 0;
    const Locale* locs = Locale::getAvailableLocales(count);
    for (int i = 0; i < count; ++i) {
        UErrorCode status = U_ZERO_ERROR;
        NumberFormat* nf = NumberFormat::createCurrencyInstance(*(locs + i), status);
        if (!nf) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getCurrencyPattern: locale %d: unable to get NumberFormat instance!",
                    i);
            continue;
        }
        std::auto_ptr<NumberFormat> ndeleter(nf);

        const UChar* currency = nf->getCurrency();
        if (!currency) {
            slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getCurrencyPattern: locale %d: failed to getCurrency!",
                    i);
            continue;
        }

        if (!ucc.compare(currency, -1)) {
            df = (DecimalFormat*) ndeleter.release();
            break;
        }
    }

    if (!df)
        return errorInJson(UNKNOWN_ERROR, "Currency not supported!");

    std::auto_ptr<DecimalFormat> deleter(df);

    const DecimalFormatSymbols* dfs = df->getDecimalFormatSymbols();
    if (!dfs) {
        slog2f(0, ID_G11N, SLOG2_ERROR, "GlobalizationNDK::getCurrencyPattern: unable to get DecimalFormatSymbols!");
        return errorInJson(UNKNOWN_ERROR, "Failed to get DecimalFormatSymbols!");
    }

    UnicodeString ucs;

    std::string pattern;
    df->toPattern(ucs);
    ucs.toUTF8String(pattern);
    ucs.remove();

    int fraction = df->getMaximumFractionDigits();
    double rounding = df->getRoundingIncrement();

    std::string decimal;
    ucs = dfs->getSymbol(DecimalFormatSymbols::kDecimalSeparatorSymbol);
    ucs.toUTF8String(decimal);
    ucs.remove();

    std::string grouping;
    ucs = dfs->getSymbol(DecimalFormatSymbols::kGroupingSeparatorSymbol);
    ucs.toUTF8String(grouping);
    ucs.remove();

    return resultInJson(pattern, cc, fraction, rounding, decimal, grouping);
}

} /* namespace webworks */
