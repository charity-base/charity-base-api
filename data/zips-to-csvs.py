import argparse
import zipfile
import os

def bcpconvert(bcpdata, lineterminator='*@@*', delimiter='@**@', quote='"', newdelimiter=',', escapechar='\\', newline='\n'):
    """
    returns data from a string of BCP data. Default is to present as CSV data.
    """
    bcpdata = bcpdata.replace(escapechar, escapechar + escapechar)
    bcpdata = bcpdata.replace(quote, escapechar + quote)
    bcpdata = bcpdata.replace(delimiter, quote + newdelimiter + quote)
    bcpdata = bcpdata.replace(lineterminator, quote + newline + quote)
    bcpdata = quote + bcpdata + quote
    return bcpdata

def import_zip(zip_file, output_dir):
    zf = zipfile.ZipFile(zip_file, 'r')
    print('Opened zip file: %s' % zip_file)
    for i in zf.namelist():
        if i[-4:]==".bcp":
            bcpdata = zf.read(i)
            bcpdata = bcpdata.decode('utf-8', errors="replace")
            bcpdata = bcpconvert(bcpdata, escapechar='"')

            csvfilename = os.path.join( output_dir, os.path.basename(i).replace(".bcp",".csv") )

            with open(csvfilename, 'wb') as csvfile:
                csvfile.write(bcpdata.encode('utf-8'))

            print('Converted: %s' % i)

def main():

    parser = argparse.ArgumentParser(description='Convert zip files to CSVs')
    parser.add_argument('--in', dest="cczip", default="./cc-register.zip", help='Path to .zip file downloaded from charity commission.')
    parser.add_argument('--out', default="./cc-register-csvs", help='Path to new (non-existent) directory to write to.')

    args = parser.parse_args()
    import_zip( args.cczip, args.out )

if __name__ == '__main__':
    main()
