<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "crud";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Manejar la solicitud POST (Crear o Actualizar)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $precio = $_POST["precio"];

    // Utilizar consultas preparadas para prevenir inyección SQL
    $stmt = $conn->prepare("INSERT INTO productos (nombre, precio) VALUES (?, ?)");
    $stmt->bind_param("sd", $nombre, $precio);

    if ($stmt->execute()) {
        echo json_encode(array("mensaje" => "Producto agregado exitosamente"));
    } else {
        echo json_encode(array("mensaje" => "Error: " . $stmt->error));
    }

    $stmt->close();
}

// Manejar la solicitud PUT (Actualizar)
if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = $_PUT["id"];
    $nombre = $_PUT["nombre"];
    $precio = $_PUT["precio"];

    // Utilizar consultas preparadas para prevenir inyección SQL
    $stmt = $conn->prepare("UPDATE productos SET nombre = ?, precio = ? WHERE id = ?");
    $stmt->bind_param("sdi", $nombre, $precio, $id);

    if ($stmt->execute()) {
        echo json_encode(array("mensaje" => "Producto actualizado exitosamente"));
    } else {
        echo json_encode(array("mensaje" => "Error: " . $stmt->error));
    }

    $stmt->close();
}

// Manejar la solicitud DELETE
if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $id = $_GET["id"];

    // Utilizar consultas preparadas para prevenir inyección SQL
    $stmt = $conn->prepare("DELETE FROM productos WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(array("mensaje" => "Producto eliminado exitosamente"));
    } else {
        echo json_encode(array("mensaje" => "Error: " . $stmt->error));
    }

    $stmt->close();
}

// Manejar la solicitud GET (Leer)
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $nombreBusqueda = isset($_GET["nombreBusqueda"]) ? $_GET["nombreBusqueda"] : "";
    
    $consulta = "SELECT * FROM productos";
    
    if (!empty($nombreBusqueda)) {
        // Agregar condición de búsqueda por nombre
        $consulta .= " WHERE nombre LIKE '%$nombreBusqueda%'";
    }

    $result = $conn->query($consulta);
    $data = array();

    while ($fila = $result->fetch_assoc()) {
        $data[] = $fila;
    }

    echo json_encode($data);
}

$conn->close();
?>
