from ndw.datex_ii.meta import XML_DATEX


class PublicComment:
    @staticmethod
    def handle_comment(situation):
        msg = ''
        gpc = situation.findall(
            '{%s}generalPublicComment/{%s}comment/{%s}values/{%s}value' % (
                XML_DATEX, XML_DATEX, XML_DATEX, XML_DATEX))
        for i in gpc:
            msg = msg + i.text + " "

        return msg
