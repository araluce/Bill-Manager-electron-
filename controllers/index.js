const remote = require('electron').remote;
const main = remote.require('./main.js');
const ipcRenderer = require('electron').ipcRenderer;
var Sequelize = require('sequelize');
const models = require('./models/index.js')
const bill_controller = require('./controllers/bill.js');
const toastr = require('./node_modules/toastr/toastr.js');
var that = this;
var global_bill_id = null;
var global_retire_id = null;
var global_unsubscribe_id = null;

$('#bill_client_dni').on('keyup', function (event) {
    bill_controller.clientDniInputKeyUp(models, Sequelize);
});

$('#bill_client_select').on('change', function (event) {
    bill_controller.billClientSelectChange(models);
});

var billTable = $('#bill_table').DataTable({
    "pageLength": 5,
    language: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ albaranes",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando albaranes del _START_ al _END_ de un total de _TOTAL_ albaranes",
        "sInfoEmpty": "Mostrando albaranes del 0 al 0 de un total de 0 albaranes",
        "sInfoFiltered": "(filtrado de un total de _MAX_ albaranes)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    }
});

var retireTable = $('#retire_table').DataTable({
    "pageLength": 5,
    language: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ retiradas",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando retiradas del _START_ al _END_ de un total de _TOTAL_ retiradas",
        "sInfoEmpty": "Mostrando retiradas del 0 al 0 de un total de 0 retiradas",
        "sInfoFiltered": "(filtrado de un total de _MAX_ retiradas)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    }
});

var unsubscribeTable = $('#unsubscribe_table').DataTable({
    "pageLength": 5,
    language: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ bajas",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando bajas del _START_ al _END_ de un total de _TOTAL_ bajas",
        "sInfoEmpty": "Mostrando bajas del 0 al 0 de un total de 0 bajas",
        "sInfoFiltered": "(filtrado de un total de _MAX_ bajas)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    }
});

$('#reload_bill_table').on('click', function () {
    updateBillTable();
});

$('#reload_retire_table').on('click', function () {
    updateRetireTable();
});

$('#reload_unsubscribe_table').on('click', function () {
    updateUnsubscribeTable();
});

function printBillPDF(id) {
    global_bill_id = id;
    models.Bill.findOne({
        where: { id: global_bill_id },
        include: [{ model: models.Client, as: 'client' }]
    }).then((billdata) => {
        bill = billdata.dataValues;
        client = bill.client.dataValues;
        bill_controller.pdfUpdateAll(client.firstName, client.lastName, client.dni, client.phone, bill.date_input, bill.lot_number, bill.weight, bill.price, bill.origin, bill.t_reception, bill.n_rsi, bill.num_hams, bill.num_palettes);
    }).catch(function (err) {
        toastr["error"]("UPS! No se han podido cargar los datos del albarán");
    });
}

function printRetirePDF(id) {
    global_retire_id = id;

    models.Retire.findOne({ where: { id: global_retire_id }, include: [{ model: models.Bill, as: 'bill' }] }).then(function (retire_data) {
        bill = retire_data.bill.dataValues

        models.Bill.findOne({ where: { id: bill.id } }).then(function (bill_data) {
            bill = bill_data.dataValues

            $('#pdf_retire_date_output').html([retire.date_output.getDate(), retire.date_output.getMonth(), retire.date_output.getFullYear()].join("/"));
            $('#pdf_retire_for').html(retire.for);
            $('#pdf_retire_lot_number').html(bill.lot_number);
            $('#pdf_retire_destination').html(retire.destination);
            $('#pdf_retire_num_hams').html(retire.num_hams);
            $('#pdf_retire_num_palettes').html(retire.num_palettes);
        }).catch(function (err) {
            toastr["error"]("UPS! No se han podido cargar los datos del albarán");
        });
    }).catch(function (err) {
        toastr["error"]("UPS! No se han podido cargar los datos de la retirada");
    });
}

function printUnsubscribePDF(id) {
    global_unsubscribe_id = id;

    models.Unsubscribe.findOne({ where: { id: global_unsubscribe_id }, include: [{ model: models.Bill, as: 'bill' }] }).then(function (unsubscribe_data) {
        unsubscribe = unsubscribe_data.dataValues
        bill = unsubscribe.bill.dataValues

        $('#pdf_unsubscribe_date_unsubscribe').html([unsubscribe.date_unsubscribe.getDate(), unsubscribe.date_unsubscribe.getMonth(), unsubscribe.date_unsubscribe.getFullYear()].join("/"));
        $('#pdf_unsubscribe_reason').html(unsubscribe.reason);
        $('#pdf_unsubscribe_observations').html(unsubscribe.observations);
        $('#pdf_unsubscribe_num_hams').html(unsubscribe.num_hams);
        $('#pdf_unsubscribe_num_palettes').html(unsubscribe.num_palettes);
    }).catch(function (err) {
        toastr["error"]("UPS! No se han podido cargar los datos de la baja");
    });
}

function showRetireEdit(id){
    global_retire_id = id;

    models.Retire.findOne({where: {id: global_retire_id}}).then(function(retire_data){
        retire = retire_data.dataValues

        $('#edit_retire_date_output').val([retire.date_output.getDate(), retire.date_output.getMonth(), retire.date_output.getFullYear()].join("/"))
        $('#edit_retire_date_consumption').val([retire.date_consumption.getDate(), retire.date_consumption.getMonth(), retire.date_consumption.getFullYear()].join("/"))
        $('#edit_retire_destination').val(retire.destination)
        $('#edit_retire_tagged').val(retire.tagged)
        $('#edit_retire_for').val(retire.for)
        $('#edit_retire_num_hams').val(retire.num_hams)
        $('#edit_retire_num_palettes').val(retire.num_palettes)
    });
}

function showUnsubscribeEdit(id){
    global_unsubscribe_id = id;

    models.Unsubscribe.findOne({where: {id: global_unsubscribe_id}}).then(function(unsubscribe_data){
        unsubscribe = unsubscribe_data.dataValues

        $('#edit_unsubscribe_date_unsubscribe').val([unsubscribe.date_unsubscribe.getDate(), unsubscribe.date_unsubscribe.getMonth(), unsubscribe.date_unsubscribe.getFullYear()].join("/"))
        $('#edit_unsubscribe_reason').html(unsubscribe.reason)
        $('#edit_unsubscribe_observations').html(unsubscribe.observations)
        $('#edit_unsubscribe_num_hams').val(unsubscribe.num_hams)
        $('#edit_unsubscribe_num_palettes').val(unsubscribe.num_palettes)
    });
}

updateBillTable();

function updateBillTable() {
    billTable.clear().draw();

    models.Bill.findAll({
        where: { deleted: false },
        include: [{ model: models.Client, as: 'client' }]
    }).then(function (bills) {
        $.each(bills, function (index, billdata) {
            bill = billdata.dataValues;
            client = bill.client.dataValues;
            date_input = new Date(bill.date_input);
            ham_rest = bill.num_hams - bill.num_hams_out
            palettes_rest = bill.num_palettes - bill.num_palettes_out
            billTable.row.add(
                [
                    bill.n_rsi,
                    bill.lot_number,
                    [date_input.getDate(), date_input.getMonth(), date_input.getFullYear()].join("/"),
                    client.firstName + ' ' + client.lastName,
                    client.dni,
                    client.phone,
                    ham_rest + ' de ' + bill.num_hams,
                    palettes_rest + ' de ' + bill.num_palettes,
                    bill.weight,
                    bill.origin,
                    bill.price + ' <span class="fa fa-eur"></span>',
                    '<a href="#tab2" data-toggle="tab" class="btn btn-default" onclick="printBillPDF(' + bill.id + ');"><span class="glyphicon glyphicon-print" aria-hidden="true"></span></a>' +
                    '<a href="#tab3" data-toggle="tab" class="btn btn-default" onclick="setBillGlobal(' + bill.id + ');"><span class="fa fa-pencil-square-o" aria-hidden="true"></span></a>' +
                    '<button class="btn btn-danger delete-bill" onclick="destroyBillQuery(' + bill.id + ');"><span class="fa fa-times" aria-hidden="true"></span></button>'
                ]
            ).draw(false);
        });
    });
}

function updateRetireTable() {
    retireTable.clear().draw();

    models.Retire.findAll({
        where: { deleted: false, bill_id: global_bill_id }
    }).then(function (retires) {
        $.each(retires, function (index, retiredata) {
            retire = retiredata.dataValues
            date_output = new Date(retire.date_output)
            date_consumption = new Date(retire.date_consumption);

            retireTable.row.add(
                [
                    [date_output.getDate(), date_output.getMonth(), date_output.getFullYear()].join("/"),
                    [date_consumption.getDate(), date_consumption.getMonth(), date_consumption.getFullYear()].join("/"),
                    retire.for,
                    retire.destination,
                    retire.tagged,
                    retire.num_hams,
                    retire.num_palettes,
                    '<a href="#tab4" data-toggle="tab" class="btn btn-default" onclick="printRetirePDF(' + retire.id + ');"><span class="glyphicon glyphicon-print" aria-hidden="true"></span></a>' +
                    '<a href="#tab5" data-toggle="tab" class="btn btn-default" onclick="showRetireEdit('+retire.id+')"><span class="fa fa-pencil-square-o" aria-hidden="true"></span></a>' +
                    '<button class="btn btn-danger" onclick="destroyRetireQuery(' + retire.id + ')"><span class="fa fa-times" aria-hidden="true"></span></button>'
                ]
            ).draw(false);
        });
    });
}

function updateUnsubscribeTable() {
    unsubscribeTable.clear().draw();

    models.Unsubscribe.findAll({
        where: { deleted: false, bill_id: global_bill_id }
    }).then(function (unsubscribes) {
        $.each(unsubscribes, function (index, unsubscribedata) {
            unsubscribe = unsubscribedata.dataValues;
            date_unsubscribe = new Date(unsubscribe.date_unsubscribe);

            unsubscribeTable.row.add(
                [
                    [date_unsubscribe.getDate(), date_unsubscribe.getMonth(), date_unsubscribe.getFullYear()].join("/"),
                    unsubscribe.reason,
                    unsubscribe.observations,
                    unsubscribe.num_hams,
                    unsubscribe.num_palettes,
                    '<a href="#tab6" data-toggle="tab" class="btn btn-default" onclick="printUnsubscribePDF(' + unsubscribe.id + ');"><span class="glyphicon glyphicon-print" aria-hidden="true"></span></a>' +
                    '<a href="#tab7" data-toggle="tab" class="btn btn-default" onclick="showUnsubscribeEdit('+unsubscribe.id+')"><span class="fa fa-pencil-square-o" aria-hidden="true"></span></a>' +
                    '<button class="btn btn-danger" onclick="removeUnsubscribe(' + unsubscribe.id + ')"><span class="fa fa-times" aria-hidden="true"></span></button>'
                ]
            ).draw(false);
        });
    });
}

$(".min-btn").on("click", function (e) {
    var window = remote.getCurrentWindow();
    window.minimize();
});

$(".close-btn").on("click", function (e) {
    var window = remote.getCurrentWindow();
    window.close();
});


function errorMessages(message) {
    content = 'Se han producido errores de validación, por favor, revise los siguientes errores:';
    $.each(message.errors, function (index, value) {
        content += '<br><strong>' + value.path + ': </strong>' + value.message;
    });
    toastr["warning"](content);
    //$('#billErrorMessage').html(content);
    errorFields(message);
}

function errorFields(message) {
    message.errors.forEach(function (error) {
        fieldTarget = document.getElementById('bill_client_' + error.path);
        parent = fieldTarget.parentElement;
        parent.className += " has-error";
    });
}

// CREATE ACTIONS

$('#createBillButton').on('click', function () {
    that = this;

    $(".has-error").removeClass('has-error');

    var date_input = $('#retire_date_output').val();
    date_input = date_input.split("/");
    date_input = new Date(date_input[2], date_input[1], date_input[0]);

    models.Client.findOrCreate({
        where: {
            firstName: $('#bill_client_firstName').val().toUpperCase(),
            lastName: $('#bill_client_lastName').val().toUpperCase(),
            dni: $('#bill_client_dni').val().toUpperCase(),
            phone: parseInt($('#bill_client_phone').val())
        }
    }).then(function (client) {
        models.Bill.findOne({
            plain: true,
            where: {
                client_id: client[0].dataValues.id,
                n_rsi: parseInt($('#bill_n_rsi').val())
            }
        }).then(function (result) {
            console.log(' ============ Unique bill ============');
            if (result) {
                toastr["warning"]("Ya existe un albarán con este R.S.I. para este cliente");
            } else {
                models.Bill.create({
                    client_id: client[0].dataValues.id,
                    origin: $('#bill_origin').val().toUpperCase(),
                    n_rsi: parseInt($('#bill_n_rsi').val()),
                    date_input: new Date($('#bill_date_input').val()),
                    lot_number: parseInt($('#bill_lot_number').val()),
                    weight: $('#bill_weight').val(),
                    price: $('#bill_price').val(),
                    t_reception: $('#bill_t_reception').val().toUpperCase(),
                    num_hams: parseInt($('#bill_num_hams').val()),
                    num_palettes: parseInt($('#bill_num_palettes').val())
                }).then(function (bill_response) {
                    toastr["success"]("Albarán creado correctamente");
                    updateBillTable();
                }).catch(function (err) {
                    console.log('====== Bill Error ======');
                    console.log(err);
                    toastr["danger"]("Se han producido errores al crear el albarán");
                });
            }
        });
    }).catch(function (err) {
        console.log(err.errors);
        that.errorMessages(err);
        toastr["warning"]("No se ha encontrado el cliente");
    });


});

$('#retireButton').on('click', function () {
    that = this

    $(".has-error").removeClass('has-error')

    var date_output = $('#retire_date_output').val()
    var date_output = date_output.split("/")
    date_output = new Date(date_output[2], date_output[1], date_output[0])

    var date_consumption = $('#retire_date_consumption').val()
    var date_consumption = date_consumption.split("/")
    date_consumption = new Date(date_consumption[2], date_consumption[1], date_consumption[0])

    num_hams = parseInt($('#retire_num_hams').val())
    num_palettes = parseInt($('#retire_num_palettes').val())
    destination = $('#retire_destination').val()
    tagged = $('#retire_tagged').val()
    retire_for = $('#retire_for').val()

    if (isNaN(date_output.getTime())) { toastr["error"]("El campo fecha de retirada no es válido"); $('#retire_date_output').addClass('has-error'); return; }
    if (isNaN(date_consumption.getTime())) { toastr["error"]("El campo fecha de consumo preferente no es válido"); $('#retire_date_consumption').addClass('has-error'); return; }
    if (!$.isNumeric(num_hams)) { toastr["error"]("El campo número de jamones debe ser numérico (puede ser 0)"); $('#retire_num_hams').addClass('has-error'); return; }
    if (!$.isNumeric(num_palettes)) { toastr["error"]("El campo número de paletas debe ser numérico (puede ser 0)"); $('#retire_num_palettes').addClass('has-error'); return; }
    if (num_hams + num_palettes <= 0) { toastr["error"]("No hay nada que retirar"); $('#retire_num_hams').addClass('has-error'); $('#retire_num_palettes').addClass('has-error'); return; }
    if (!destination.trim()) { toastr["error"]("El campo destino final está vacío"); $('#retire_destination').addClass('has-error'); return; }
    if (!tagged.trim()) { toastr["error"]("El campo etiquetado con está vacío"); $('#retire_tagged').addClass('has-error'); return; }
    if (!retire_for.trim()) { toastr["error"]("El campo retirado por está vacío"); $('#retire_for').addClass('has-error'); return; }

    models.Bill.findOne({ plain: true, where: { id: global_bill_id } }).then(function (bill_data) {
        bill = bill_data.dataValues

        ham_rest = bill.num_hams - bill.num_hams_out - num_hams
        palettes_rest = bill.num_palettes - bill.num_palettes_out - num_palettes

        if (ham_rest < 0) {
            toastr["error"]("No tienes suficientes jamones");
            return;
        }

        if (palettes_rest < 0) {
            toastr["error"]("No tienes suficientes paletas");
            return;
        }

        models.Retire.create({
            bill_id: global_bill_id,
            date_output: date_output,
            date_consumption: date_consumption,
            destination: destination.toUpperCase(),
            tagged: tagged.toUpperCase(),
            for: retire_for.toUpperCase(),
            num_hams: num_hams,
            num_palettes: num_palettes
        }).then(function () {
            toastr["success"]("Retirada registrada correctamente");

            models.Bill.update({ num_hams_out: bill.num_hams_out + num_hams, num_palettes_out: bill.num_palettes_out + num_palettes }, { where: { id: bill.id } }).then(function (result_bill_updated) {
                updateBillTable();
                toastr["success"]("Albarán actualizado");
            }).catch(function (err) {
                toastr["error"]("Hubo un error al actualizar el albarán");
                console.log(err);
            });

            updateRetireTable();
        }).catch(function (err) {
            errorMessages(err);
            toastr["warning"]("No se ha podido registrar la retirada");
        });
    });
});

$('#unsubscribeButton').on('click', function () {
    that = this

    $(".has-error").removeClass('has-error')

    var date_unsubscribe = $('#unsubscribe_date_unsubscribe').val()
    var date_unsubscribe = date_unsubscribe.split("/")
    date_unsubscribe = new Date(date_unsubscribe[2], date_unsubscribe[1], date_unsubscribe[0])

    num_hams = parseInt($('#unsubscribe_num_hams').val())
    num_palettes = parseInt($('#unsubscribe_num_palettes').val())
    reason = $('#unsubscribe_reason').val()
    observations = $('#unsubscribe_observations').val()

    if (isNaN(date_unsubscribe.getTime())) { toastr["error"]("El campo fecha de baja no es válido"); $('#unsubscribe_date_unsubscribe').addClass('has-error'); return; }
    if (!$.isNumeric(num_hams)) { toastr["error"]("El campo número de jamones debe ser numérico (puede ser 0)"); $('#unsubscribe_num_hams').addClass('has-error'); return; }
    if (!$.isNumeric(num_palettes)) { toastr["error"]("El campo número de paletas debe ser numérico (puede ser 0)"); $('#unsubscribe_num_palettes').addClass('has-error'); return; }
    if (num_hams + num_palettes <= 0) { toastr["error"]("Nada que dar de baja"); $('#unsubscribe_num_hams').addClass('has-error'); $('#unsubscribe_num_palettes').addClass('has-error'); return; }
    if (!reason.trim()) { toastr["error"]("El campo razón está vacío"); $('#unsubscribe_reason').addClass('has-error'); return; }

    models.Bill.findOne({ plain: true, where: { id: global_bill_id } }).then(function (bill_data) {
        bill = bill_data.dataValues

        ham_rest = bill.num_hams - bill.num_hams_out - num_hams
        palettes_rest = bill.num_palettes - bill.num_palettes_out - num_palettes

        if (ham_rest < 0) {
            toastr["error"]("No tienes suficientes jamones");
            return;
        }

        if (palettes_rest < 0) {
            toastr["error"]("No tienes suficientes paletas");
            return;
        }

        models.Unsubscribe.create({
            bill_id: global_bill_id,
            date_unsubscribe: date_unsubscribe,
            reason: reason.toUpperCase(),
            observations: observations.toUpperCase(),
            num_hams: num_hams,
            num_palettes: num_palettes
        }).then(function () {
            toastr["success"]("Baja registrada correctamente");

            models.Bill.update({ num_hams_out: bill.num_hams_out + num_hams, num_palettes_out: bill.num_palettes_out + num_palettes }, { where: { id: bill.id } }).then(function (result_bill_updated) {
                updateBillTable();
                toastr["success"]("Albarán actualizado");
            }).catch(function (err) {
                toastr["error"]("Hubo un error al actualizar el albarán");
                console.log(err);
            });

            updateUnsubscribeTable();
        }).catch(function (err) {
            errorMessages(err);
            toastr["warning"]("No se ha podido registrar la retirada");
        });
    });
});

$('#editRetireButton').on('click', function () {
    that = this

    $(".has-error").removeClass('has-error')

    var date_output = $('#edit_retire_date_output').val()
    var date_output = date_output.split("/")
    date_output = new Date(date_output[2], date_output[1], date_output[0])

    var date_consumption = $('#edit_retire_date_consumption').val()
    var date_consumption = date_consumption.split("/")
    date_consumption = new Date(date_consumption[2], date_consumption[1], date_consumption[0])

    num_hams = parseInt($('#edit_retire_num_hams').val())
    num_palettes = parseInt($('#edit_retire_num_palettes').val())
    destination = $('#edit_retire_destination').val()
    tagged = $('#edit_retire_tagged').val()
    retire_for = $('#edit_retire_for').val()

    if (isNaN(date_output.getTime())) { toastr["error"]("El campo fecha de retirada no es válido"); $('#edit_retire_date_output').addClass('has-error'); return; }
    if (isNaN(date_consumption.getTime())) { toastr["error"]("El campo fecha de consumo preferente no es válido"); $('#edit_retire_date_consumption').addClass('has-error'); return; }
    if (!$.isNumeric(num_hams)) { toastr["error"]("El campo número de jamones debe ser numérico (puede ser 0)"); $('#edit_retire_num_hams').addClass('has-error'); return; }
    if (!$.isNumeric(num_palettes)) { toastr["error"]("El campo número de paletas debe ser numérico (puede ser 0)"); $('#edit_retire_num_palettes').addClass('has-error'); return; }
    if (num_hams + num_palettes <= 0) { toastr["error"]("No hay nada que retirar"); $('#edit_retire_num_hams').addClass('has-error'); $('#edit_retire_num_palettes').addClass('has-error'); return; }
    if (!destination.trim()) { toastr["error"]("El campo destino final está vacío"); $('#edit_retire_destination').addClass('has-error'); return; }
    if (!tagged.trim()) { toastr["error"]("El campo etiquetado con está vacío"); $('#edit_retire_tagged').addClass('has-error'); return; }
    if (!retire_for.trim()) { toastr["error"]("El campo retirado por está vacío"); $('#edit_retire_for').addClass('has-error'); return; }

    models.Retire.findOne({where: {id: global_retire_id}, include: [{ model: models.Bill, as: 'bill' }]}).then(function(retire_data){
        retire = retire_data.dataValues
        bill = retire.bill.dataValues

        previous_num_hams = retire.num_hams
        previous_num_palettes = retire.num_palettes

        ham_rest = bill.num_hams - bill.num_hams_out + previous_num_hams - num_hams
        palettes_rest = bill.num_palettes - bill.num_palettes_out + previous_num_palettes - num_palettes

        if (ham_rest < 0) {
            toastr["error"]("No tienes suficientes jamones");
            return;
        }
    
        if (palettes_rest < 0) {
            toastr["error"]("No tienes suficientes paletas");
            return;
        }
    
        models.Retire.update({
            date_output: date_output,
            date_consumption: date_consumption,
            destination: destination.toUpperCase(),
            tagged: tagged.toUpperCase(),
            for: retire_for.toUpperCase(),
            num_hams: num_hams,
            num_palettes: num_palettes
        }, { 
            where: { id: retire.id } 
        }).then(function () {
            toastr["success"]("Retirada registrada correctamente");
    
            models.Bill.update({ 
                num_hams_out: bill.num_hams_out - previous_num_hams + num_hams, 
                num_palettes_out: bill.num_palettes_out - previous_num_palettes + num_palettes 
            }, { 
                where: { id: bill.id } 
            }).then(function (result_bill_updated) {
                updateBillTable();
                toastr["success"]("Albarán actualizado");
            }).catch(function (err) {
                toastr["error"]("Hubo un error al actualizar el albarán");
                console.log(err);
            });
    
            updateRetireTable();
        }).catch(function (err) {
            errorMessages(err);
            toastr["warning"]("No se ha podido registrar la retirada");
        });
    }).catch(function(error){
        toastr["warning"]("No se ha encontrado la retirada a modificar");
    });
});

$('#editUnsubscribeButton').on('click', function () {
    that = this

    $(".has-error").removeClass('has-error')

    var date_unsubscribe = $('#edit_unsubscribe_date_unsubscribe').val()
    var date_unsubscribe = date_unsubscribe.split("/")
    date_unsubscribe = new Date(date_unsubscribe[2], date_unsubscribe[1], date_unsubscribe[0])

    num_hams = parseInt($('#edit_unsubscribe_num_hams').val())
    num_palettes = parseInt($('#edit_unsubscribe_num_palettes').val())
    reason = $('#edit_unsubscribe_reason').val()
    observations = $('#edit_unsubscribe_observations').val()

    if (isNaN(date_unsubscribe.getTime())) { toastr["error"]("El campo fecha de baja no es válido"); $('#edit_unsubscribe_date_unsubscribe').addClass('has-error'); return; }
    if (!$.isNumeric(num_hams)) { toastr["error"]("El campo número de jamones debe ser numérico (puede ser 0)"); $('#edit_unsubscribe_num_hams').addClass('has-error'); return; }
    if (!$.isNumeric(num_palettes)) { toastr["error"]("El campo número de paletas debe ser numérico (puede ser 0)"); $('#edit_unsubscribe_num_palettes').addClass('has-error'); return; }
    if (num_hams + num_palettes <= 0) { toastr["error"]("Nada que dar de baja"); $('#edit_unsubscribe_num_hams').addClass('has-error'); $('#edit_unsubscribe_num_palettes').addClass('has-error'); return; }
    if (!reason.trim()) { toastr["error"]("El campo razón está vacío"); $('#edit_unsubscribe_reason').addClass('has-error'); return; }

    models.Unsubscribe.findOne({ plain: true, where: { id: global_bill_id }, include: [{ model: models.Bill, as: 'bill' }] }).then(function (unsubscribe_data) {
        unsubscribe = unsubscribe_data.dataValues
        bill = unsubscribe.bill.dataValues

        previous_num_hams = retire.num_hams
        previous_num_palettes = retire.num_palettes

        ham_rest = bill.num_hams - bill.num_hams_out + previous_num_hams - num_hams
        palettes_rest = bill.num_palettes - bill.num_palettes_out + previous_num_palettes - num_palettes

        if (ham_rest < 0) {
            toastr["error"]("No tienes suficientes jamones");
            return;
        }

        if (palettes_rest < 0) {
            toastr["error"]("No tienes suficientes paletas");
            return;
        }

        models.Unsubscribe.update({
            date_unsubscribe: date_unsubscribe,
            reason: reason.toUpperCase(),
            observations: observations.toUpperCase(),
            num_hams: num_hams,
            num_palettes: num_palettes
        }, { 
            where: { id: unsubscribe.id } 
        }).then(function () {
            toastr["success"]("Baja registrada correctamente");

            models.Bill.update({ 
                num_hams_out: bill.num_hams_out - previous_num_hams + num_hams, 
                num_palettes_out: bill.num_palettes_out - previous_num_palettes + num_palettes 
            }, { 
                where: { id: bill.id } 
            }).then(function (result_bill_updated) {
                updateBillTable();
                toastr["success"]("Albarán actualizado");
            }).catch(function (err) {
                toastr["error"]("Hubo un error al actualizar el albarán");
                console.log(err);
            });

            updateUnsubscribeTable();
        }).catch(function (err) {
            errorMessages(err);
            toastr["warning"]("No se ha podido registrar la retirada");
        });
    });
});

toastr["info"]("Bienvenido a la plataforma de gestión de albaranes", "Jamones El Mirador dice:")

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

function setBillGlobal(id) {
    global_bill_id = id;
    updateRetireTable();
    updateUnsubscribeTable();
}

function destroyBillQuery(id){
    global_bill_id = id

    toastr["warning"]("<br /><br /><button type='button' id='confirmationRevertYes' class='btn clear'>Si</button>",'¿Está seguro que quiere eliminar el albarán?',
    {
        closeButton: true,
        allowHtml: true,
        onShown: function (toast) {
            $("#confirmationRevertYes").click(function(){
              destroyBill();
            });
          }
    });
    return;
}

function destroyBill(){
    models.Bill.findOne({ where: { id: global_bill_id } }).then(function (bill_data) {
        models.Retire.findAll({where: {bill_id: global_bill_id} }).then(function(retires){
            $.each(retires, function(index, retire_data){
                global_retire_id = retire_data.dataValues.id
                destroyRetire(false);
            })
        });

        models.Unsubscribe.findAll({where: {bill_id: global_bill_id} }).then(function(unsubscribes){
            $.each(unsubscribes, function(index, unsubscribe_data){
                global_unsubscribe_id = unsubscribe_data.dataValues.id
                destroyUnsubscribe(false);
            })
        });

        bill_data.destroy({ force: true })
        .then(function () {toastr["success"]("El albarán ha sido eliminado correctamente"); updateBillTable();})
        .catch(function (err) {toastr["error"]("No se ha podido eliminar el albarán")});
    }).catch(function (err) {
        console.log(err);
        toastr["error"]("No se ha encontrado el albarán o ya se ha eliminado");
    });
}

function destroyRetireQuery(id){
    global_retire_id = id

    toastr["warning"]("<br /><br /><button type='button' id='confirmationRevertYes' class='btn clear'>Si</button>",'¿Está seguro que quiere eliminar el registro de retirada?',
    {
        closeButton: true,
        allowHtml: true,
        onShown: function (toast) {
            $("#confirmationRevertYes").click(function(){
              destroyRetire(true);
            });
          }
    });
    return;
}

function destroyRetire(notify){
    models.Retire.findOne({ where: { id: global_retire_id }, include: [{ model: models.Bill, as: 'bill' }]}).then(function (retire_data) {
        retire = retire_data.dataValues
        bill = retire.bill.dataValues

        models.Bill.update({ num_hams_out: bill.num_hams_out - retire.num_hams, num_palettes_out: bill.num_palettes_out - retire.num_palettes }, { where: { id: bill.id } }).then(function (result_bill_updated) {
            updateBillTable()
            updateRetireTable()
        }).catch(function (err) {
            console.log(err)
        });

        retire_data.destroy({ force: true })
        .then(function () {
            if(notify) {
                toastr["success"]("El registro de retirada ha sido eliminado correctamente")
            }
        })
        .catch(function (err) {toastr["error"]("No se ha podido eliminar el registro de retirada")});
    }).catch(function (err) {
        console.log(err)
        toastr["error"]("No se ha encontrado el registro de retirada o ya se ha eliminado")
    });
}

function destroyUnsubscribeQuery(id){
    global_unsubscribe_id = id

    toastr["warning"]("<br /><br /><button type='button' id='confirmationRevertYes' class='btn clear'>Si</button>",'¿Está seguro que quiere eliminar el registro de baja?',
    {
        closeButton: true,
        allowHtml: true,
        onShown: function (toast) {
            $("#confirmationRevertYes").click(function(){
                destroyUnsubscribe(true);
            });
          }
    });
    return;
}

function destroyUnsubscribe(notifiy){
    models.Unsubscribe.findOne({ where: { id: global_unsubscribe_id }, include: [{ model: models.Bill, as: 'bill' }]}).then(function (unsubscribe_data) {
        unsubscribe = unsubscribe_data.dataValues
        bill = unsubscribe.bill.dataValues

        models.Bill.update({ num_hams_out: bill.num_hams_out - unsubscribe.num_hams, num_palettes_out: bill.num_palettes_out - unsubscribe.num_palettes }, { where: { id: bill.id } }).then(function (result_bill_updated) {
            updateBillTable()
            updateUnsubscribeTable()
        }).catch(function (err) {
            console.log(err)
        });

        unsubscribe_data.destroy({ force: true })
        .then(function () {
            if(notify) {
                toastr["success"]("El registro de baja ha sido eliminado correctamente")
            }
        })
        .catch(function (err) {toastr["error"]("No se ha podido eliminar el registro de baja")});
    }).catch(function (err) {
        console.log(err)
        toastr["error"]("No se ha encontrado el registro de baja o ya se ha eliminado")
    });
}