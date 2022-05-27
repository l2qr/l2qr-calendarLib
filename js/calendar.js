class Utils {
    static getmonthsLenghts(yearArg) {
        return {
            "01": 31,
            "02": this.isLeapYear(yearArg) ? 29 : 28,
            "03": 31,
            "04": 30,
            "05": 31,
            "06": 30,
            "07": 31,
            "08": 31,
            "09": 30,
            "10": 31,
            "11": 30,
            "12": 31,
        }
    }

    static isLeapYear(yearArg) {
        if (yearArg % 4 !== 0) {
            return false;
        }
        else if (yearArg % 100 !== 0) {
            return true;
        }
        else if (yearArg % 400 !== 0) {
            return false;
        }
        return true;
    }
}

class Calendar {
    currentDate;
    date; year; month; day;
    hour; minute;
    calendarElement = document.getElementById("l2qr-calendar");

    constructor(dateString) {
        this.setNewDate(dateString);
        this.currentDate = new Date(Date.now());
        this.createCalendar();
    }

    addStyles(path) {
        let stylesheet = document.createElement('link');
        stylesheet.type = 'text/css';
        stylesheet.rel = 'stylesheet';
        stylesheet.href = path;
        document.head.appendChild(stylesheet);

    }

    setNewDate(dateString) {
        if (dateString) {
            this.date = new Date(dateString);
        } else if (this.date) {
            this.date = new Date(this.year + "-" + this.month + "-" + this.day + "T" + this.hour + ":" + this.minute)
        } else {
            this.date = new Date(Date.now());
        }
        let dateTimeISOStrings = this.date.toISOString().split("T");
        let dateArr = dateTimeISOStrings[0].split("-");
        let timeArr = dateTimeISOStrings[1].split(":");

        this.year = dateArr[0];
        this.month = dateArr[1];
        this.day = dateArr[2];
        this.hour = timeArr[0];
        this.minute = timeArr[1];
    }

    monthChangeListener(ev) {
        this.month = ev.target.value;
        this.setNewDate();
        this.fillCalendarTable();
    }

    yearChangeListener(ev) {
        this.year = ev.target.value;
        this.setNewDate();
        this.fillCalendarTable();
    }

    btnClickListener(ev) {
        let activeButtons = document.querySelectorAll('.dayBtn.active');
        activeButtons.forEach(but => {
            but.classList.remove('active');
        });
        ev.target.classList.add('active');
        let selectedDay = ev.target.getAttribute('data-date').substring(ev.target.getAttribute('data-date').lastIndexOf('-') + 1, ev.target.getAttribute('data-date').lenght);
        this.day = selectedDay;
        this.setNewDate();
    }

    createCalendar() {
        this.calendarElement.innerHTML = "";

        let calendarNav = document.createElement('div');
        calendarNav.setAttribute('class', 'calendar-nav');

        let monthSelect = document.createElement('select');
        monthSelect.setAttribute('name', 'monthSelect');
        monthSelect.setAttribute('id', 'calendar-monthSelect');
        monthSelect.innerHTML = "<option value=\"01\">January</option>"
            + "<option class=\"month-select\" value=\"02\"> February</option>"
            + "<option value=\"03\">March</option>"
            + "<option value=\"04\">April</option>"
            + "<option value=\"05\">May</option>"
            + "<option value=\"06\">June</option>"
            + "<option value=\"07\">July</option>"
            + "<option value=\"08\">August</option>"
            + "<option value=\"09\">September</option>"
            + "<option value=\"10\">October</option>"
            + "<option value=\"11\">November</option>"
            + "<option value=\"12\">December</option>";
        monthSelect.value = this.month;
        monthSelect.addEventListener('change', (ev) => this.monthChangeListener(ev));
        calendarNav.appendChild(monthSelect);

        let yearSelect = document.createElement('select');
        yearSelect.setAttribute('name', 'yearSelect');
        yearSelect.setAttribute('id', 'calendar-yearSelect');

        let currentYear = this.currentDate.getFullYear();
        for (let i = 0; i < 5; i++) {
            let year = document.createElement('option');
            year.setAttribute('value', parseInt(currentYear) + i);
            year.innerText = parseInt(currentYear) + i;
            yearSelect.appendChild(year);
        }
        yearSelect.value = this.year;
        yearSelect.addEventListener('change', (ev) => this.yearChangeListener(ev));
        calendarNav.appendChild(yearSelect);

        this.calendarElement.appendChild(calendarNav);

        let tableElement = document.createElement('table');
        tableElement.setAttribute('id', 'calendar-table');

        let tableHeader = document.createElement('tr');
        tableHeader.setAttribute('id', 'calendar-table-header');
        tableHeader.innerHTML = "<td>Mo</td><td>Tu</td><td>We</td><td>Th</td><td>Fr</td><td>Sa</td><td>Su</td>";
        tableElement.appendChild(tableHeader);
        this.calendarElement.appendChild(tableElement);

        this.fillCalendarTable();
    }

    fillCalendarTable() {
        let tableElement = document.getElementById('calendar-table');
        let weekRows = tableElement.querySelectorAll('.calendar-week');
        if (weekRows.length !== 0) {
            weekRows.forEach(row => {
                row.remove();
            });
        }

        let firstOfTheMonthString = this.year + "-" + this.month + "-01";
        let frontOfTheTableOffset = new Date(firstOfTheMonthString).getDay() - 1;
        if (frontOfTheTableOffset === -1) {
            frontOfTheTableOffset = 6;
        }
        let monthLenght = Utils.getmonthsLenghts(this.year)[this.month];
        let tableLenght = monthLenght + frontOfTheTableOffset;
        tableLenght += 7 - tableLenght % 7;

        let rows = tableLenght / 7;
        let cols = 7;

        for (let i = 0; i < rows; i++) {
            let row = document.createElement('tr');
            row.setAttribute('class', 'calendar-week');
            for (let j = 0; j < cols; j++) {
                let cell = document.createElement('td');
                let dayIndex = i * 7 + j + 1;
                let dayNo = dayIndex - frontOfTheTableOffset;
                if (dayIndex > frontOfTheTableOffset && dayIndex <= monthLenght + frontOfTheTableOffset) {
                    let dayButton = document.createElement('button');
                    dayButton.setAttribute('class', 'dayBtn');
                    dayButton.setAttribute('value', 'dayBtn');

                    dayButton.innerHTML = dayNo;
                    let dateAttributeStr = this.year + "-" + this.month + "-";
                    dateAttributeStr += dayNo < 10 ? "0" + dayNo : dayNo;
                    dayButton.setAttribute('data-date', dateAttributeStr);
                    cell.appendChild(dayButton);
                }
                row.appendChild(cell);
            }
            tableElement.appendChild(row);
        }

        let buttons = document.querySelectorAll('.dayBtn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (ev) => this.btnClickListener(ev))
        });
    }
}

let calendar = new Calendar();
calendar.addStyles('l2qr-calendar-styles.css');