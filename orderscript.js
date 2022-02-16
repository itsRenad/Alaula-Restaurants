
//New Work
function sort(target, type) {
    var $wrapper = target;

    if (type === 0){
        $wrapper.find('.column').sort(function (a, b) {
            return parseInt($(a).find(".price")[0].innerHTML) - parseInt($(b).find(".price")[0].innerHTML);
        }).appendTo($wrapper);
    }else{
        $wrapper.find('.column').sort(function (a, b) {
            return parseInt($(b).find(".price")[0].innerHTML) - parseInt($(a).find(".price")[0].innerHTML)
        }).appendTo($wrapper);
    }

}

function formProcess(event) {
    event.preventDefault();

    let data = $(event.target).serializeArray();
    let info = {}
    let items = []
    if (data.some(e => e.name === "tablenumber")) {
        data.forEach(entry => {
            if (entry.name !== "tablenumber" && entry.value > 0) {
                let item = {}
                item.name = entry.name.replaceAll("-", " ").split("_")[0]
                item.price = entry.name.replaceAll("-", " ").split("_")[1]
                item.qty = entry.value;
                items.push(item)
            } else if (entry.name === "tablenumber") {
                info.table = entry.value;
            }
        })
        info.key = Math.floor(Math.random() * 999999) + 111111;
        info.list = items;
        let d = JSON.parse(localStorage.getItem("lastOrders"))
        d.push(info)
        localStorage.setItem("lastOrders", JSON.stringify(d))
        window.location.reload();
    } else {
        alert("Table Not Selected")
    }
}

$(document).ready(function () {
    if (localStorage.getItem("lastOrders") === null){
        localStorage.setItem("lastOrders", "[]")
    }
    let json = JSON.parse(localStorage.getItem("lastOrders"))
    json.forEach((el, k) => {
        let div = $('<div id="invoice-' + k + '" style="min-width: 300px;margin: 10px;" data-key="'+el.key+'"/>')

        let table = $('<table style="border: 1px solid black; width: 100%;"/>');
        let tr = $('<tr/>');
        let price = 0
        el.list.forEach(item => {
            price = price + (item.price*item.qty)
            let tr = $('<tr/>');
            tr.append("<td>" + item.name + "</td>");
            tr.append("<td>" + item.qty + "</td>");
            tr.append("<td>" + item.price*item.qty + "</td>");
            table.append(tr)
        })
        tr.append("<th colspan='2' style='text-align: left;color: white;background-color: #9e817e;'>Table Number: " + el.table + "</th>");
        tr.append("<th style='text-align: left;color: white;background-color: #9e817e;'>Total: " + price + "</th>");
        table.prepend(tr)

table.append(`<tfoot class="no-print"><tr><td colspan="2">Print Invoice</td><td><button type="button" onclick="makeTableAvailable('`+el.table+`');printDiv('` + "invoice-" + k + `'`+',' + el.key +`);">Print</button></td></tr></tfoot>`)

        div.append(table)
        $('.invoices').append(div)
    })

});


function printDiv(divID, key) {
    let d = JSON.parse(localStorage.getItem("lastOrders"));

    let filtered = d.filter(function(el) { return el.key != key });

    localStorage.setItem("lastOrders", JSON.stringify(filtered))

    var divToPrint = document.getElementById(divID);
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write(`<html lang="en"><head><title>Print</title><style>@media print{.no-print, .no-print *{display: none !important;}}</style></head><body onload="window.print()">` + divToPrint.innerHTML + `</body></html>`);
    newWin.document.close();
    setTimeout(function () {
        newWin.close();
        window.location.reload();
    }, 50);

}

