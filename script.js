document.getElementById("wifi-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const ssid = document.getElementById("ssid").value.trim();
    const encryption = document.getElementById("encryption").value;
    const password = document.getElementById("password").value.trim();

    if (!ssid) {
        alert("Por favor, introduce el nombre de la red (SSID).");
        return;
    }

    // Construir el formato del Wi-Fi QR Code
    let wifiString = `WIFI:S:${ssid};T:${encryption};P:${password};;`;

    if (encryption === "nopass") {
        wifiString = `WIFI:S:${ssid};T:nopass;;`;
    }

    // Generar el QR
    const qrCodeCanvas = document.getElementById("qrcode");
    QRCode.toCanvas(qrCodeCanvas, wifiString, { width: 250 }, function (error) {
        if (error) {
            console.error(error);
            alert("Hubo un error al generar el código QR. Inténtalo de nuevo.");
        } else {
            // Mostrar el modal
            const modal = document.getElementById("modal");
            modal.style.display = "block";
        }
    });
});

// Cerrar el modal
document.getElementById("close-modal").addEventListener("click", function () {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
});

// Descargar el QR como PDF
document.getElementById("download-pdf").addEventListener("click", async function () {
    const { jsPDF } = window.jspdf; // Obtener jsPDF del objeto global
    const canvas = document.getElementById("qrcode");
    
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // Convertir el QR a imagen
    const imgData = canvas.toDataURL("image/png");
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Título centrado
    pdf.setFontSize(16);
    const title = "Código QR - Información Wi-Fi";
    const titleWidth = pdf.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    pdf.text(title, titleX, 10);

    // Agregar el código QR
    pdf.addImage(imgData, "PNG", 50, 20, 100, 100); // Ajustar posición y tamaño

    // Pie de página
    pdf.setFontSize(10);
    pdf.text("Desarrollado por J. Donis071 ", pageWidth / 2, pdf.internal.pageSize.height - 10, { align: "center" });

    pdf.save("wifi-qr.pdf");
});

// Mostrar y ocultar la contraseña
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");

togglePassword.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.querySelector("i").classList.toggle("fa-eye-slash");
});
