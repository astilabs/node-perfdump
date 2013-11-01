node-perfdump
=============

Grabs all performance test data from a Voisus Server and outputs to CSV for off-line analysis


## Installation

```
git clone git@github.com:astilabs/node-perfdump.git
cd node-perfdump
npm link
```

## Updating
To make sure you are using the latest version you just need to pull down the latest changes and re-run npm link:
```
git pull
npm link
```

## Usage

```
perfdump --help
```
  Usage: perfdump [options]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -s, --server <ip>             server ip address
    -n, --scenario <scenario id>  scenario id
    -i, --ignore <true/false>     ignore failed tests. default: [true]
    -o, --outfile <file>          output path. default: /Users/rossk/perf.csv


## Example
```
[~]$ perfdump -s vbs3.hearvoisus.com -n e673f38989514ccda3bf0ffc82083f17 -o ./out.csv
  - server: vbs3.hearvoisus.com
  - scenario: e673f38989514ccda3bf0ffc82083f17
  - ignore: true
  - outfile: ./out.csv
Connecting to: vbs3.hearvoisus.com on scenario: e673f38989514ccda3bf0ffc82083f17
wrote: Performance_test_report-2
ignored: Performance_test_report-1
Complete
```

## Dumped Data

Currently node-perfdump writes out the following data:

* Test Name
* Total Clients
* Server Version
* Memory
* CPU Count
* Memory Used
* Memory Free
* CPU0 %
* CPU1 %
* CPU2 %
* CPU3 %
* Ace-operator Overruns
* Ace-operator Underruns
* Ace-operator Frame Rate
* Ace-operator Average Frame Rate
* Ace-operator Max Time
* Ace-operator Worst Time
* Ace-operator Average Time
* Ace-Radio Overruns
* Ace-Radio Underruns
* Ace-Radio Frame Rate
* Ace-Radio Average Frame Rate
* Ace-Radio Max Time
* Ace-Radio Worst Time
* Ace-Radio Average Time
