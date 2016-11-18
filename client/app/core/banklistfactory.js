/*
Factories are used to store all the common functionalities
This function here is used to store and provide bank list data locally in the browser side and helps to reduce data load on the back-end apis
NOTE used in recipient controller
*/
(function () {
    'use strict';
    // create a dummy Bank list for testing and developemnt from local json file
    var DummyBanklist = function () {
        var banklist = [{
            "BANKNAME": "AXIS BANK",
            "BANKCODE": "UTIB"
        }, {
            "BANKNAME": "BANK OF BARODA",
            "BANKCODE": "BARB"
        }, {
            "BANKNAME": "BANK OF INDIA",
            "BANKCODE": "BKID"
        }, {
            "BANKNAME": "CENTRAL BANK OF INDIA",
            "BANKCODE": "CBIN"
        }, {
            "BANKNAME": "CITIBANK NA",
            "BANKCODE": "CITI"
        }, {
            "BANKNAME": "HDFC BANK LTD",
            "BANKCODE": "HDFC"
        }, {
            "BANKNAME": "ICICI BANK LTD",
            "BANKCODE": "ICIC"
        }, {
            "BANKNAME": "IDBI BANK LTD",
            "BANKCODE": "IBKL"
        }, {
            "BANKNAME": "INDIAN BANK",
            "BANKCODE": "IDIB"
        }, {
            "BANKNAME": "INDIAN OVERSEAS BANK",
            "BANKCODE": "IOBA"
        }, {
            "BANKNAME": "PUNJAB NATIONAL BANK",
            "BANKCODE": "PUNB"
        }, {
            "BANKNAME": "STATE BANK OF BIKANER AND JAIPUR",
            "BANKCODE": "SBBJ"
        }, {
            "BANKNAME": "UNION BANK OF INDIA",
            "BANKCODE": "UBIN"
        }, {
            "BANKNAME": "UCO BANK",
            "BANKCODE": "UCBA"
        }, {
            "BANKNAME": "YES BANK",
            "BANKCODE": "YESB"
        }, {
            "BANKNAME": "DENA BANK",
            "BANKCODE": "BKDN"
        }, {
            "BANKNAME": "ABHYUDAYA CO-OP BANK LTD",
            "BANKCODE": "ABHY"
        }, {
            "BANKNAME": "ALLAHABAD BANK",
            "BANKCODE": "ALLA"
        }, {
            "BANKNAME": "ANDHRA BANK",
            "BANKCODE": "ANDB"
        }, {
            "BANKNAME": "BANK OF MAHARASHTRA",
            "BANKCODE": "MAHB"
        }, {
            "BANKNAME": "BASSEIN CATHOLIC CO-OP BANK LTD",
            "BANKCODE": "BACB"
        }, {
            "BANKNAME": "BNP PARIBAS",
            "BANKCODE": "BNPA"
        }, {
            "BANKNAME": "CANARA BANK",
            "BANKCODE": "CNRB"
        }, {
            "BANKNAME": "CATHOLIC SYRIAN BANK LTD",
            "BANKCODE": "CSBK"
        }, {
            "BANKNAME": "CITY UNION BANK LTD",
            "BANKCODE": "CIUB"
        }, {
            "BANKNAME": "CORPORATION BANK",
            "BANKCODE": "CORP"
        }, {
            "BANKNAME": "DBS BANK LTD",
            "BANKCODE": "DBSS"
        }, {
            "BANKNAME": "DEVELOPMENT CREDIT BANK LIMITED",
            "BANKCODE": "DCBL"
        }, {
            "BANKNAME": "DHANLAXMI BANK LTD",
            "BANKCODE": "DLXB"
        }, {
            "BANKNAME": "DOMBIVLI NAGARI SAHAKARI BANK LIMITED",
            "BANKCODE": "DNSB"
        }, {
            "BANKNAME": "HSBC",
            "BANKCODE": "HSBC"
        }, {
            "BANKNAME": "INDUSIND BANK LIMITED",
            "BANKCODE": "INDB"
        }, {
            "BANKNAME": "ING VYSYA BANK",
            "BANKCODE": "VYSA"
        }, {
            "BANKNAME": "JANATA SAHAKARI BANK LTD (PUNE)",
            "BANKCODE": "JSBP"
        }, {
            "BANKNAME": "KARNATAKA BANK LTD",
            "BANKCODE": "KARB"
        }, {
            "BANKNAME": "KARUR VYSYA BANK",
            "BANKCODE": "KVBL"
        }, {
            "BANKNAME": "KOTAK MAHINDRA BANK",
            "BANKCODE": "KKBK"
        }, {
            "BANKNAME": "NKGSB CO-OP BANK LTD",
            "BANKCODE": "NKGS"
        }, {
            "BANKNAME": "NUTAN NAGARIK SAHAKARI BANK LTD",
            "BANKCODE": "NNSB"
        }, {
            "BANKNAME": "ORIENTAL BANK OF COMMERCE",
            "BANKCODE": "ORBC"
        }, {
            "BANKNAME": "PARSIK JANATA SAHAKARI BANK LTD",
            "BANKCODE": "PJSB"
        }, {
            "BANKNAME": "PUNJAB AND MAHARASHTRA CO-OP BANK LTD",
            "BANKCODE": "PMCB"
        }, {
            "BANKNAME": "PUNJAB AND SIND BANK",
            "BANKCODE": "PSIB"
        }, {
            "BANKNAME": "SOUTH INDIAN BANK",
            "BANKCODE": "SIBL"
        }, {
            "BANKNAME": "STANDARD CHARTERED BANK",
            "BANKCODE": "SCBL"
        }, {
            "BANKNAME": "STATE BANK OF HYDERABAD",
            "BANKCODE": "SBHY"
        }, {
            "BANKNAME": "STATE BANK OF MYSORE",
            "BANKCODE": "SBMY"
        }, {
            "BANKNAME": "STATE BANK OF TRAVANCORE",
            "BANKCODE": "SBTR"
        }, {
            "BANKNAME": "STATE BANK OF PATIALA",
            "BANKCODE": "STBP"
        }, {
            "BANKNAME": "SYNDICATE BANK",
            "BANKCODE": "SYNB"
        }, {
            "BANKNAME": "TAMILNAD MERCANTILE BANK LTD",
            "BANKCODE": "TMBL"
        }, {
            "BANKNAME": "THE COSMOS CO-OPERATIVE BANK LTD",
            "BANKCODE": "COSB"
        }, {
            "BANKNAME": "THE FEDERAL BANK LTD",
            "BANKCODE": "FDRL"
        }, {
            "BANKNAME": "THE GREATER BOMBAY CO-OP BANK LTD",
            "BANKCODE": "GBCB"
        }, {
            "BANKNAME": "THE JAMMU AND KASHMIR BANK LTD",
            "BANKCODE": "JAKA"
        }, {
            "BANKNAME": "THE KALUPUR COMMERCIAL CO OP BANK LTD",
            "BANKCODE": "KCCB"
        }, {
            "BANKNAME": "THE KALYAN JANATA SAHAKARI BANK LTD",
            "BANKCODE": "KJSB"
        }, {
            "BANKNAME": "THE LAKSHMI VILAS BANK LTD",
            "BANKCODE": "LAVB"
        }, {
            "BANKNAME": "THE MEHSANA URBAN COOPERATIVE BANK LTD",
            "BANKCODE": "MSNU"
        }, {
            "BANKNAME": "THE NAINITAL BANK LIMITED",
            "BANKCODE": "NTBL"
        }, {
            "BANKNAME": "THE RATNAKAR BANK LTD",
            "BANKCODE": "RATN"
        }, {
            "BANKNAME": "THE SARASWAT CO-OPERATIVE BANK LTD",
            "BANKCODE": "SRCB"
        }, {
            "BANKNAME": "THE THANE JANATA SAHAKARI BANK LTD",
            "BANKCODE": "TJSB"
        }, {
            "BANKNAME": "VIJAYA BANK",
            "BANKCODE": "VIJB"
        }, {
            "BANKNAME": "STATE BANK OF INDIA",
            "BANKCODE": "SBIN"
        }, {
            "BANKNAME": "THE A.P. MAHESH CO-OP URBAN BANK LTD.",
            "BANKCODE": "APMC"
        }, {
            "BANKNAME": "UNITED BANK OF INDIA",
            "BANKCODE": "UTBI"
        }, {
            "BANKNAME": "Baroda Rajasthan Kshetriya Gramin Bank",
            "BANKCODE": "BARR"
        }, {
            "BANKNAME": "Baroda Uttar Pradesh Gramin Bank",
            "BANKCODE": "BARU"
        }, {
            "BANKNAME": "Baroda Gujarat Gramin Bank",
            "BANKCODE": "BGGB"
        }, {
            "BANKNAME": "Maharashtra Gramin Bank",
            "BANKCODE": "MAHG"
        }, {
            "BANKNAME": "Purvanchal Gramin Bank",
            "BANKCODE": "SRGB"
        }, {
            "BANKNAME": "Saurashtra Gramin Bank",
            "BANKCODE": "SSGB"
        }, {
            "BANKNAME": "Utkal Gramya Bank",
            "BANKCODE": "SUUG"
        }, {
            "BANKNAME": "Karnataka Vikas Grameena Bank",
            "BANKCODE": "SYKG"
        }, {
            "BANKNAME": "Andhra Pragathi Grameena Bank",
            "BANKCODE": "SYNG"
        }, {
            "BANKNAME": "Janaseva Sahakari Bank Ltd.",
            "BANKCODE": "JANA"
        }, {
            "BANKNAME": "Kallapana Ichalkaranji Awade Janaseva Sahakari Bank",
            "BANKCODE": "KAIJ"
        }, {
            "BANKNAME": "Pandharpur Merchant Co-operative Bank",
            "BANKCODE": "ICIP"
        }, {
            "BANKNAME": "Gayatri Bank",
            "BANKCODE": "HDGB"
        }, {
            "BANKNAME": "Pochampally Co-op Urban Bank Ltd.",
            "BANKCODE": "HDFP"
        }, {
            "BANKNAME": "Dr. Annasaheb Chougule Urban Co-op Bank Ltd.",
            "BANKCODE": "HDFA"
        }, {
            "BANKNAME": "Surat District Co-op Bank",
            "BANKCODE": "SDCB"
        }, {
            "BANKNAME": "Suco Souharda Sahakari Bank Ltd",
            "BANKCODE": "HDFS"
        }, {
            "BANKNAME": "Pune Peoples Co-Operative Bank",
            "BANKCODE": "IBKP"
        }, {
            "BANKNAME": "Shri Arihant Co-operative Bank Ltd.",
            "BANKCODE": "ICSA"
        }, {
            "BANKNAME": "The National Co-operative Bank Ltd.",
            "BANKCODE": "KKBN"
        }, {
            "BANKNAME": "Parshwanath Co-operative Bank Ltd.",
            "BANKCODE": "HDPA"
        }, {
            "BANKNAME": "APNA Sahakari Bank Ltd",
            "BANKCODE": "ASBL"
        }, {
            "BANKNAME": "Jalore Nagrik Sahakari Bank Ltd.",
            "BANKCODE": "HDJC"
        }, {
            "BANKNAME": "Varachha Co-op Bank Ltd.",
            "BANKCODE": "VARA"
        }, {
            "BANKNAME": "Janata Co-operative Bank Ltd., Malegaon",
            "BANKCODE": "HDFJ"
        }, {
            "BANKNAME": "Shri Basaveshwar Sahakari Bank Niyamit, Bagalkot",
            "BANKCODE": "ICIS"
        }, {
            "BANKNAME": "The Shirpur Peoples Co-op Bank Ltd",
            "BANKCODE": "KKBS"
        }, {
            "BANKNAME": "Kerala Gramin Bank",
            "BANKCODE": "KLGB"
        }, {
            "BANKNAME": "Pragathi Krishna Gramin Bank",
            "BANKCODE": "PKGB"
        }, {
            "BANKNAME": "Yadagiri Lakshmi Narasimha Swamy Co Op Urban Bank Ltd",
            "BANKCODE": "YESP"
        }, {
            "BANKNAME": "Hutatma Sahakari Bank Ltd.",
            "BANKCODE": "ICIH"
        }, {
            "BANKNAME": "The Adarsh Urban Co-op. Bank Ltd., Hyderabad",
            "BANKCODE": "ICIA"
        }, {
            "BANKNAME": "The Mayani Urban Co-operative Bank Ltd",
            "BANKCODE": "ICIM"
        }, {
            "BANKNAME": "The Pandharpur Urban Co-op Bank Ltd",
            "BANKCODE": "ICPU"
        }, {
            "BANKNAME": "Shree Veershaiv Co-op Bank Ltd",
            "BANKCODE": "CVCB"
        }, {
            "BANKNAME": "Thrissur District Central Co-op Bank Ltd",
            "BANKCODE": "TDCB"
        }, {
            "BANKNAME": "Vishweshwar Co-op. Bank Ltd.",
            "BANKCODE": "VSBL"
        }, {
            "BANKNAME": "Raipur Urban Mercantile Co-operative Bank Ltd.",
            "BANKCODE": "HDRU"
        }, {
            "BANKNAME": "FARIDABAD",
            "BANKCODE": "SBFA"
        }, {
            "BANKNAME": "SHIVALIK MERCANTILE CO-OP. BANK LTD",
            "BANKCODE": "IBSM"
        }, {
            "BANKNAME": "The Hasti Co-op Bank Ltd.",
            "BANKCODE": "HCBL"
        }, {
            "BANKNAME": "Rajgurunagar Sahakari Bank Ltd.",
            "BANKCODE": "RSBL"
        }, {
            "BANKNAME": "Bandhan Bank",
            "BANKCODE": "BDBL"
        }, {
            "BANKNAME": "Dapoli Urban Co-Op Bank, Dapoli",
            "BANKCODE": "IBDU"
        }, {
            "BANKNAME": "The Gujarat State Co-op Bank Ltd.",
            "BANKCODE": "GSCB"
        }, {
            "BANKNAME": "The Municipal Co-operative Bank Ltd.",
            "BANKCODE": "MUBL"
        }, {
            "BANKNAME": "Rajapur Urban Co-op Bank Ltd.",
            "BANKCODE": "ICRU"
        }, {
            "BANKNAME": "Ahmedabad District Central Co-op Bank Ltd.",
            "BANKCODE": "GSAD"
        }, {
            "BANKNAME": "IDFC Bank",
            "BANKCODE": "IDFB"
        }, {
            "BANKNAME": "Rajasthan Marudhara Gramin Bank",
            "BANKCODE": "SBRM"
        }, {
            "BANKNAME": "Suvarnayug Sahakari Bank Ltd.",
            "BANKCODE": "SUSB"
        }, {
            "BANKNAME": "The Sutex Co-operative Bank Ltd.",
            "BANKCODE": "SUCO"
        }];
        // var to deal with the bank factory
        var bankfactory = {};
        // returns a banklist object to controller
        bankfactory.getBanklist = function () {
            return banklist;
        };
        return bankfactory;
    };

    angular.module("app").factory('DummyBanklist', DummyBanklist);
}());
