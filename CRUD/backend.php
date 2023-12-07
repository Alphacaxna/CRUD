<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "crud";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $precio = $_POST["precio"];

    $stmt = $conn->prepare("INSERT INTO productos (nombre, precio) VALUES (?, ?)");
    $stmt->bind_param("sd", $nombre, $precio);

    if ($stmt->execute()) {
        $response["mensaje"] = "Producto agregado exitosamente";
    } else {
        $response["error"] = "Error al ejecutar la consulta: " . $stmt->error;
    }

    $stmt->close();
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = $_PUT["id"];
    $nombre = $_PUT["nombre"];
    $precio = $_PUT["precio"];

    $stmt = $conn->prepare("UPDATE productos SET nombre = ?, precio = ? WHERE id = ?");
    $stmt->bind_param("sdi", $nombre, $precio, $id);

    if ($stmt->execute()) {
        $response["mensaje"] = "Producto actualizado exitosamente";
    } else {
        $response["error"] = "Error al ejecutar la consulta: " . $stmt->error;
    }

    $stmt->close();
} elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $id = $_GET["id"];

    $stmt = $conn->prepare("DELETE FROM productos WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        $response["mensaje"] = "Producto eliminado exitosamente";
    } else {
        $response["error"] = "Error al ejecutar la consulta: " . $stmt->error;
    }

    $stmt->close();
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    $nombreBusqueda = isset($_GET["nombreBusqueda"]) ? $_GET["nombreBusqueda"] : "";
    
    $consulta = "SELECT * FROM productos";
    
    if (!empty($nombreBusqueda)) {
        $consulta .= " WHERE nombre LIKE '%$nombreBusqueda%'";
    }

    $result = $conn->query($consulta);

    if ($result) {
        $data = array();

        while ($fila = $result->fetch_assoc()) {
            $data[] = $fila;
        }

        $response["data"] = $data;
    } else {
        $response["error"] = "Error al ejecutar la consulta: " . $conn->error;
    }
}

// Añade el encabezado de respuesta para indicar que se envía JSON
header('Content-Type: application/json');

// Imprime la respuesta JSON
echo json_encode($response);

$conn->close();

?>
