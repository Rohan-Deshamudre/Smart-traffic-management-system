import os

import requests
import gzip
import shutil


def make_file(base_loc, endpoint, extension):
    return base_loc % (endpoint, extension)


def get_XMLGZ(base_loc, endpoint):
    return make_file(base_loc, endpoint, 'xml.gz')


def getXML(base_loc, endpoint):
    return make_file(base_loc, endpoint, 'xml')


def get(url, endpoint, base_loc):
    print('send')
    response = requests.get(url % endpoint)
    print(response)
    xmlgz_file = get_XMLGZ(base_loc, endpoint)
    xml_file = getXML(base_loc, endpoint)
    with open(xmlgz_file, 'wb') as file:
        file.write(response.content)
        with gzip.open(xmlgz_file, 'rb') as f_in:
            with open(xml_file, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        os.remove(xmlgz_file)
