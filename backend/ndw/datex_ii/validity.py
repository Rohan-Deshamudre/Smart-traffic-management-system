from datetime import datetime

from ndw.datex_ii.meta import XML_DATEX


class Validity:

    @staticmethod
    def handle_time_specification(validity):
        timespec = validity.find('{%s}validityTimeSpecification' % XML_DATEX)

        start = timespec.find('{%s}overallStartTime' % XML_DATEX).text
        end = timespec.find('{%s}overallEndTime' % XML_DATEX)
        end = end.text if end is not None else end

        curr_time = datetime.now()

        try:
            start_time = datetime.strptime(start, '%Y-%m-%dT%H:%M:%S.%fZ')
            end_time = datetime.strptime(end, '%Y-%m-%dT%H:%M:%S.%fZ') \
                if end else curr_time
        except ValueError as _:
            start_time = datetime.strptime(start, '%Y-%m-%dT%H:%M:%SZ')
            end_time = datetime.strptime(end,
                                         '%Y-%m-%dT%H:%M:%SZ') \
                if end else curr_time

        return start_time < curr_time <= end_time

    @staticmethod
    def handle_duration(situation):
        validity = situation.find('{%s}validity' % XML_DATEX)
        status = validity.find('{%s}validityStatus' % XML_DATEX).text

        if status == 'definedByValidityTimeSpec':
            return Validity.handle_time_specification(validity)
        else:
            return status == 'active'
