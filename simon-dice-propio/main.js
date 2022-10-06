let movimientosMaquina = []
let movimientosUsuario = []
let ronda = 0
let recordRonda = 0

document.querySelector("#boton-jugar").onclick = comenzarJuego


bloquearInputsUsuario()

function comenzarJuego(){
    reiniciarSecuencias()
    manejarRonda()
}

function reiniciarSecuencias(){
    movimientosMaquina=[]
    movimientosUsuario = []
    ronda = 0
}

function manejarRonda(){
    actualizarEstado("Turno de la IA")
    bloquearInputsUsuario()

    const $cuadroNuevo = nuevoCuadroAleatorio()
    movimientosMaquina.push($cuadroNuevo)

    const RETRASO_TURNO_JUGADOR = (movimientosMaquina.length + 1) * 1000

    movimientosMaquina.forEach(function($cuadro,index){
        const RETRASO_MS = (index + 1) * 1000
        setTimeout(function(){
            resaltarCuadro($cuadro)
        },RETRASO_MS)
    })

    setTimeout(function(){
        actualizarEstado("Tu turno")
        desbloquearInputsUsuario()
    },RETRASO_TURNO_JUGADOR)

    movimientosUsuario= []
    ronda++
    actualizarNumeroDeRondas(ronda)
}


function actualizarEstado(estado, error = false){
    const $barraEstado = document.querySelector("#barra-estado")
    $barraEstado.textContent = estado
    if(error){
        $barraEstado.classList.remove("alert-primary")
        $barraEstado.classList.add("alert-danger")
    }else{
        $barraEstado.classList.remove("alert-danger")
        $barraEstado.classList.add("alert-primary")
    }
}

function bloquearInputsUsuario(){
    document.querySelectorAll(".cuadro").forEach(function($cuadro){
        $cuadro.onclick = function(){}
    })
}

function nuevoCuadroAleatorio(){
    const $cuadros = document.querySelectorAll(".cuadro")
    const index = Math.floor(Math.random() * $cuadros.length)
    return $cuadros[index]
}

function desbloquearInputsUsuario(){
    document.querySelectorAll(".cuadro").forEach(function($cuadro){
        $cuadro.onclick = manejarInputsUsuario
    })
}

function manejarInputsUsuario(e){
    const $cuadro = e.target
    resaltarCuadro($cuadro)
    movimientosUsuario.push($cuadro)

    const $cuadroMaquina = movimientosMaquina[movimientosUsuario.length - 1]
    if($cuadro.id !== $cuadroMaquina.id){
        perder()
        return
    }

    if(movimientosUsuario.length === movimientosMaquina.length){
        bloquearInputsUsuario()
        setTimeout(manejarRonda,1000)
    }
}

function resaltarCuadro($cuadro){
    $cuadro.style.opacity = 1
    setTimeout(function(){
        $cuadro.style.opacity = 0.3
    },750)
}

function perder(){
    bloquearInputsUsuario()
    actualizarEstado("GAME OVER. Click en `Jugar` para empezar de nuevo",true)
    actualizarRondaRecord()
}

function actualizarNumeroDeRondas(ronda){
    document.querySelector("#ronda").innerHTML = `Ronda ${ronda}`
}

function actualizarRondaRecord(){
    if(ronda>recordRonda){
        recordRonda = ronda
        document.querySelector("#ronda-maxima").innerHTML =`Ronda mas alta: ${recordRonda}`
        alert("Felicidades! Conseguiste un nuevo record de rondas!")
    }
}