 // array for tables  
 var tablesData = [];
    tablesData[0] = { tableNumber: 'T1', capacity: 2, reserved: false };
    tablesData[1] = { tableNumber: 'T2', capacity: 2, reserved: false };
    tablesData[2] = { tableNumber: 'T3', capacity: 4, reserved: false };
    tablesData[3] = { tableNumber: 'T4', capacity: 4, reserved: false };
    tablesData[4] = { tableNumber: 'T5', capacity: 4, reserved: false };
    tablesData[5] = { tableNumber: 'T6', capacity: 4, reserved: false };
    tablesData[6] = { tableNumber: 'T7', capacity: 6, reserved: false };


    var reservedTablesStorage = JSON.parse(localStorage.getItem('reservedTables'));
    if( reservedTablesStorage ) {
        reservedTablesStorage.forEach(function(reservedTableValue) {
            tablesData.forEach(function(tableDataValue) {
                if(tableDataValue.tableNumber == reservedTableValue.tableNumber) {
                    tableDataValue.reserved = true;
                }
            });
        });
    }

    var userInformation = [];
    
    window.addEventListener('DOMContentLoaded', function() {

        // Reservation Page;
        if(document.querySelector('#reservedPage')) {

            initTables();

            var errorClass = 'form-error';
            var modal = document.getElementById("mymodal");
            var modalForm  = modal.querySelector('form');
            var btn   = document.getElementById("reservation-btn");
            var close  = document.getElementsByClassName("fa fa-times")[0];
            var inputs = modal.querySelectorAll('input[data-pattern]');
            var tableNumberInput = modal.querySelector('.table-number-input');
            var guestInput = modal.querySelector('.guest-input');
            var phoneInput = modal.querySelector('.phone-input');
            var guestNameInput = modal.querySelector('.guest-name-input');
            var timeInput = modal.querySelector('.time-input');
            var dateInput = modal.querySelector('.date-input');
            var guestFilter = document.querySelector('.guest-filter');

// form show when click new reservation 
btn.onclick = function () {
    modalForm.reset();
    modal.style.display = "block";
}
close.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
//event of seaching the guest 
            guestFilter.oninput = function (event) {
                var input, filter, tr, td, i, txtValue;
                input = this;
                filter = input.value.toUpperCase();
                tr = document.querySelectorAll(".seat-card-wrap > div");
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].querySelector(".guest-name-p");
                    if (td) {
                        txtValue = td.innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                            tr[i].classList.remove('seat-card-hidden');
                        } else {
                            tr[i].style.display = "none";
                            tr[i].classList.add('seat-card-hidden');
                        }
                    }       
                }
                document.querySelector('.seat-card-total').innerHTML = document.querySelectorAll(".seat-card:not(.seat-card-hidden)").length;
            }

            // When form submitted
            modalForm.onsubmit = function () {
             // valdition empty fields 
                inputs.forEach(function (input) {
                    validateInputPattern(input);
                });

                validatePhoneNumber(phoneInput, true);

                validateGuest(guestInput, tableNumberInput);

                if(! this.querySelector('.'+ errorClass) ) {
                    if (confirm('Do you want to confirm this reservation?')) {
                        tablesData.forEach(function(tableDataValue) {
                            if(tableDataValue.tableNumber == tableNumberInput.value) {
                                tableDataValue.reserved = true;
                            }
                        });
                        var infoToBeSaved = { tableNumber: tableNumberInput.value, guestName: guestNameInput.value, guest: guestInput.value, phoneNumber: phoneInput.value, time: timeInput.value, date: dateInput.value };
                        var reservedTablesStorage = JSON.parse(localStorage.getItem('reservedTables'));
                        reservedTablesStorage     = reservedTablesStorage ? reservedTablesStorage : [];
                        reservedTablesStorage.push(infoToBeSaved);
                        userInformation.push(infoToBeSaved);
                        localStorage.setItem('reservedTables', JSON.stringify(reservedTablesStorage));
                        initTables();
                        modal.style.display = "none";
                    }
                    
                }
             
            }
           

            // Validations

            inputs.forEach(function(input) {
                input.oninput = function () {
                    validateInputPattern(this);
                }
            });

            phoneInput.oninput = function () {
                validatePhoneNumber(this, false);
            }

            guestInput.oninput = function () {
                if(this.value && this.value < 1) this.value = 1;
                validateGuest(this, tableNumberInput);
            }

            tableNumberInput.oninput = function () {
                this.value = this.value.toUpperCase();
                if (this.nextElementSibling) this.nextElementSibling.remove();
                this.classList.remove(errorClass);
            }

            tableNumberInput.onblur = function () {
                if (this.nextElementSibling) this.nextElementSibling.remove();
                validateTableNumber(this, guestInput, tableNumberInput);
            }

            function validateInputPattern(input) {
                if (input.nextElementSibling) input.nextElementSibling.remove();
                input.classList.remove(errorClass);
                var pattern = input.getAttribute('data-pattern');
                if (!new RegExp(pattern, 'g').test(input.value)) {
                    input.classList.add(errorClass);
                    insertAfter(errorElement(input.getAttribute('data-invalid-msg')), input);
                }
            }

            function validatePhoneNumber(input, formSubmitEvent) {
                if (input.nextElementSibling) input.nextElementSibling.remove();
                input.classList.remove(errorClass);
                if ( (formSubmitEvent && input.value.length != 13 ) || (!formSubmitEvent && input.value.length > 13) || !new RegExp(input.getAttribute('data-pattern'), 'g').test(input.value)) {
                    input.classList.add(errorClass);
                    insertAfter(errorElement('Invalid phone number'), input);
                }
            }

            function validateGuest(guestInput, tableNumberInput) {
                var tableCapacity = 0;

                tablesData.forEach(function(tableDataValue){
                    if(tableDataValue.tableNumber == tableNumberInput.value && !tableDataValue.reserved) {
                        tableCapacity = tableDataValue.capacity;
                    }
                });

                if (tableCapacity) {
                    if (guestInput.nextElementSibling) guestInput.nextElementSibling.remove();
                    if (guestInput.value <= tableCapacity) {
                        guestInput.classList.remove(errorClass);
                    }
                    else {
                        guestInput.classList.add(errorClass);
                        insertAfter(errorElement('Maximum guests for this table: ' + tableCapacity + '<br> please choose another table'), guestInput);
                    }
                }
            }

            function validateTableNumber(input, guestInput, tableNumberInput) {
                if (input.value) {
                    var value = input.value;
                    var tableCapacity = 0;
                    
                    tablesData.forEach(function(tableDataValue){
                        if(tableDataValue.tableNumber == value && !tableDataValue.reserved) {
                            tableCapacity = tableDataValue.capacity;
                        }
                    });
                    
                    if (tableCapacity) {
                        validateGuest(guestInput, tableNumberInput);
                    }
                    else {
                        input.classList.add(errorClass);
                        insertAfter(errorElement('Invalid Table Number'), input);
                    }
                }
            }

            function errorElement(msg) {
                var errorEl = document.createElement('DIV');
                errorEl.innerHTML = msg;
                return errorEl;
            }

            function insertAfter(newNode, referenceNode) {
                referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
            }

            // Initialize Tables
            function initTables() {
                document.querySelector('.table-images').innerHTML = '';
                document.querySelector('.table-number-container').innerHTML = '';
                document.querySelector('.seat-card-wrap').innerHTML = '';

                var availability = 0;
                tablesData.forEach(function(tableDataValue){
                    var newTable = document.createElement('DIV');
                    newTable.classList.add('table-img');
                    newTable.setAttribute('data-tablenumber', tableDataValue.tableNumber);
                    if (tableDataValue.reserved) {
                        newTable.classList.add('reserved-table');
                    }
                    newTable.innerHTML = '<img src="imgs/' + (tableDataValue.tableNumber.toLowerCase()) + '-' + (tableDataValue.reserved ? 'no' : 'yes') + '.png" alt="" />';
                    document.querySelector('.table-images').appendChild(newTable);

                    // Available tables , table details 
                    if (!tableDataValue.reserved) {
                        var availableTable = document.createElement('DIV');
                        availableTable.classList.add('table-number-wrapper');
                        availableTable.innerHTML = '<div class="table-number"><p>' + tableDataValue.tableNumber + '</p></div><i class="fa fa-user">1-' + (tableDataValue.capacity) + '</i>';
                        document.querySelector('.table-number-container').appendChild(availableTable);
                        availability++;
                    }
                });

                document.querySelector('.available span').innerHTML = availability;

                    // show seated guest info 
                var reservedTablesStorage = JSON.parse(localStorage.getItem('reservedTables'));
                if( reservedTablesStorage ) {
                    var reserved = 0;
                    
                    reservedTablesStorage.forEach(function(reservedTableValue){

                        var userIcons = '';

                        for (let index = 0; index < reservedTableValue.guest; index++) {
                            userIcons += '<i class="fa fa-user"></i>';
                        }

                        var reservedTable = document.createElement('DIV');
                        reservedTable.classList.add('seat-card');
                        reservedTable.innerHTML = '<div class="time"><p>'+tConvert(reservedTableValue.time)+'</p></div>'+
                                                  '<div class="guest"><p class="guest-name-p">'+reservedTableValue.guestName+'</p>'+
                                                  '<small>'+reservedTableValue.phoneNumber+' <br> '+userIcons+' guests</small></div>';
                    
                        document.querySelector('.seat-card-wrap').appendChild(reservedTable);
                        reserved++;

                    });

                    document.querySelector('.seat-card-total').innerHTML = reserved;
                }
                     //form show when click on the table img
                var tables = document.querySelectorAll('.table-images > div:not(.reserved-table)');
                var reservedTables = document.querySelectorAll('.table-images > div.reserved-table');

              
                tables.forEach(function (table) {
                    table.onclick = function () {
                        modalForm.reset();
                        modal.style.display = "block";
                    }
                });

                reservedTables.forEach(function (table) {
                    table.onclick = function () {
                        alert('this table is reserved');
                        info(table.getAttribute('data-tablenumber'));
                    }
                });
                


            }

           // style the time format in guest card  
            function tConvert (time) {
                
                time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

                if (time.length > 1) { 
                    time = time.slice (1); 
                    time[5] = +time[0] < 12 ? ' AM' : ' PM';
                    time[0] = +time[0] % 12 || 12;
                }
                return time.join (''); 
            }

        }

        // Order Page 
        if(document.querySelector('#orderPage')) {
            initTableNumberDropdown();
        }
       
        // display guest information 
        function info (tableNumber)
        {

        var reservedTableInfo;
        userInformation.forEach(function(userInformationValue){
            if(userInformationValue.tableNumber == tableNumber) {
                reservedTableInfo  = userInformationValue;
            }
        });

        if(!reservedTableInfo) return;

        // var reservedTableInfo;
        // var reservedTablesStorage = JSON.parse(localStorage.getItem('reservedTables'));
        // reservedTablesStorage.forEach(function(reservedTableValue){
        //     if(reservedTableValue.tableNumber == tableNumber) {
        //         reservedTableInfo  = reservedTableValue;
        //     }
        // });
        
            
        var arr = [] ;
        arr[0] = "Name :  " + reservedTableInfo.guestName;       
        arr[1] = "phone number:  " + reservedTableInfo.phoneNumber;       
        arr[2] = "number of guests:  " + reservedTableInfo.guest;          
        arr[3] = "date :  " + reservedTableInfo.date;              
        arr[4] = "time :  " + reservedTableInfo.time;          
        arr[5] = "table No. :  " + tableNumber;        
        
        
        var inf ='Guest information : '+ '\n';
        for(i= 0 ; i<=5 ; i++)
        {
        inf += arr[i] + '\n' ;
        }
        alert(inf);
        
    
        }
    });

    var reservedTablesStorage = JSON.parse(localStorage.getItem('reservedTables'));

    function makeTableAvailable(tableNumber) {
        if(reservedTablesStorage) {
            reservedTablesStorage.forEach(function(reservedTableValue, reservedTableIndex){
                if(reservedTableValue.tableNumber == tableNumber) {
                    reservedTablesStorage.splice(reservedTableIndex, 1);
                    localStorage.setItem('reservedTables', JSON.stringify(reservedTablesStorage));
                    initTableNumberDropdown();
                }
            });
        }
    }

    // Init table number dropdown
    function initTableNumberDropdown() {
        var tableNumberDropdown = document.querySelector('.tablenumber-dropdown');
        tableNumberDropdown.innerHTML = '';
        if (reservedTablesStorage) {
            reservedTablesStorage.forEach(function(reservedTableValue){
                var newOption = document.createElement('option');
                newOption.setAttribute('value', reservedTableValue.tableNumber);
                newOption.innerHTML = 'Table #'+reservedTableValue.tableNumber.replace(/^\D+/g, '');
                tableNumberDropdown.appendChild(newOption);
            });
        }
    }
   