$(document).ready(function () {
    $('#val_compra, #val_entrada').inputmask('decimal', {
        radixPoint: ',',
        groupSeparator: '.',
        autoGroup: true,
        digits: 2,
        digitsOptional: false,
        placeholder: '0',
        rightAlign: true,
        removeMaskOnSubmit: false,
    });

    const currencySettings = {
        style: "currency",
        currency: "BRL",
    };
    let taxes = [];

    $.getJSON("data/taxes.json", function (data) {
        taxes = data;
    }).fail(function () {
        console.error("Erro ao carregar o arquivo JSON de taxas.");
    });

    $("#calc").click(function () {
        performCalc();
    });

    function reverseFormatNumber(value, locale) {
        const formatter = new Intl.NumberFormat(locale);
        const decimalSeparator = formatter.format(1.1).substring(1, 2);
        const thousandSeparator = formatter.format(1000).substring(1, 2);
        const sanitizedValue = value
            .replace(new RegExp(`\\${thousandSeparator}`, "g"), "")
            .replace(new RegExp(`\\${decimalSeparator}`), ".");
        return isNaN(Number(sanitizedValue)) ? 0 : Number(sanitizedValue);
    }

    function performCalc() {
        const totalValueInput = $("#val_compra").val();
        const entryValueInput = $("#val_entrada").val();

        if (!totalValueInput || reverseFormatNumber(totalValueInput, "pt-BR") === 0) {
            alert("Por favor, preencha o valor total da compra.");
            return;
        }

        const totalValue = reverseFormatNumber(totalValueInput, "pt-BR");
        const entryValue = reverseFormatNumber(entryValueInput, "pt-BR");

        const debitValue = totalValue - entryValue;
        const withTaxValue = debitValue * 1.02; 

        const roundedWithTax = Number(withTaxValue.toFixed(2));
        const roundedTotal = Number((entryValue + roundedWithTax).toFixed(2));

        updateSingleResult(roundedWithTax, roundedTotal);

        processInstallments(debitValue, entryValue);
    }

    function updateSingleResult(roundedWithTax, roundedTotal) {
        const maskedWithTax = roundedWithTax.toLocaleString("pt-BR", currencySettings);
        const maskedTotal = roundedTotal.toLocaleString("pt-BR", currencySettings);

        $("#parcelVal").text(maskedWithTax);
        $("#totalVal").text(maskedTotal);
    }

    function processInstallments(debitValue, entryValue) {
        Object.keys(taxes).forEach(key => {
            const tax = taxes[key];
            const installmentNumber = parseInt(key.replace("x", ""));
            const installmentValue = (debitValue * tax) / installmentNumber;
            const totalValue = entryValue + debitValue * tax;

            updateResultTable(installmentNumber, installmentValue, totalValue);
        });

        showResultTable();
    }

    function updateResultTable(installmentNumber, installmentValue, totalValue) {
        const installmentSelector = `#fin_${installmentNumber}x`;

        $(`${installmentSelector} .parcel`).text(
            installmentValue.toLocaleString("pt-BR", currencySettings)
        );
        $(`${installmentSelector} .total`).text(
            totalValue.toLocaleString("pt-BR", currencySettings)
        );
    }

    function showResultTable() {
        $("#resultTable").fadeIn();
        document.getElementById("resultTable").scrollIntoView({
            behavior: "smooth",
        });
    }
});
