class Cronometro {
    constructor() {
        this.segundos = 0
        this.minutos = 0
        this.isCronometroAtivo = false
    }
    atualizaCronometro() {
        if (this.isCronometroAtivo) {
            this.segundos++
            if (this.segundos >= 60) {
                this.minutos++
                this.segundos = 0
            }
            if (this.minutos == 60 && this.segundos == 0) {
                alert("TEMPO ESGOTADO")
            }
            const segundosString = this.segundos <= 9 ? `0${this.segundos}` : `${this.segundos}`
            const minutosString = this.minutos <= 9 ? `0${this.minutos}` : `${this.minutos}`
            const cronometro = `${minutosString}:${segundosString}`
            document.getElementById('cronometro').textContent = cronometro
        }
    }
    pararCronometro() {
        this.isCronometroAtivo = false
    }
    iniciaCronometro() {
        this.isCronometroAtivo = true
    }
}

//*******CRONOMETRO********
const cronometro = new Cronometro()
setInterval(() => { //o cronômetro não “para” no sentido de cancelar o setInterval, ele apenas congela o valor exibido. O setInterval continua sendo chamado a cada segundo, mas como a flag está em false, nada é atualizado.
    cronometro.atualizaCronometro()
}, 1000);

// ORIENTAÇÕES PARA APLICAÇÃO DO CRONOMETRO :
// 1. Instalar o arquivo cronometro.js
// 2. escrever o caminho do arquivo no index.htm acima do arquivo scrpt.js (onde estarão as chamadas dos métodos do cronômetro)
// 3. Inserir o código abaixo no arquivo script.js, acima da função que deverá acionar o cronômetro:
//*******CRONOMETRO********
// setInterval(() => {
//     cronometro.atualizaCronometro()
// }, 1000);
// 4. Identificar onde (qual função e comando) deverá acionar o método iniciaCronometro()
// do cronômetro, por exemplo, neste caso, no clique da primeira tecla do teclado.
// 5. Identificar onde (qual função e comando) deverá acionar o método pararCronometro()
// do cronômetro, por exemplo, neste caso, na function verificaPalavraSecreta(input)
// assim que todos os inputs forem preenchidos, ou seja, quando a palavra secreta for digitada.
