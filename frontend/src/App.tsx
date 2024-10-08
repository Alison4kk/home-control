import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { io } from "socket.io-client";
import { ToggleButton } from "primereact/togglebutton";
import { InputSwitch } from "primereact/inputswitch";
import { TabPanel, TabView } from "primereact/tabview";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Toast } from 'primereact/toast';
import { Card } from "primereact/card";



const socket = io('localhost:4000');

interface EstadosDispositivos {
  salaLuzOn: boolean;
  salaTvOn: boolean;
  salaTvCanal: number;
  salaAcOn: boolean;
  salaAcTemp: number;
  cozinhaLuzOn: boolean;
  cozinhaGeladeiraTemp: number;
  cozinhaFogaoOn: boolean;
  cozinhaFogaoPotencia: number;
  quartoLuzOn: boolean;
  quartoVentiladorOn: boolean;
  quartoVentiladorVelocidade: number;
  quartoCortinaOn: boolean;
}

// Cozinha
//  Luzes Inteligentes
//  Comportamento esperado: O usuário deve poder ligar e desligar as luzes.
//  Estados: Ligado/Desligado.
//  Geladeira Inteligente
//  Comportamento esperado: Monitorar a temperatura interna da geladeira e alertar o usuário se a temperatura subir além do valor definido.
//  Estados: Temperatura interna, Alerta (acionado quando acima de 5°C).
//  Fogão Elétrico
//  Comportamento esperado: O usuário deve poder ligar e desligar o fogão elétrico e ajustar o nível de potência.
//  Estados: Ligado/Desligado, Potência (ajustável de 1 a 5).
// Quarto
//  Luzes Inteligentes
//  Comportamento esperado: O usuário deve poder ligar e desligar as luzes.
//  Estados: Ligado/Desligado.
//  Ventilador Inteligente
//  Comportamento esperado: O usuário deve poder ligar e desligar o ventilador e ajustar a velocidade.
//  Estados: Ligado/Desligado, Velocidade (1 a 3).
//  Cortinas Automáticas
//  Comportamento esperado: O usuário deve poder abrir e fechar as cortinas.
//  Estados: Aberto/Fechado.



function App() {
  const [count, setCount] = useState(0);

  const [dispositivo, setDispositivo] = useState<EstadosDispositivos>({
    salaLuzOn: false,
    salaTvOn: false,
    salaTvCanal: 0,
    salaAcOn: false,
    salaAcTemp: 24,
    cozinhaLuzOn: false,
    cozinhaGeladeiraTemp: 0,
    cozinhaFogaoOn: false,
    cozinhaFogaoPotencia: 0,
    quartoLuzOn: false,
    quartoVentiladorOn: false,
    quartoVentiladorVelocidade: 0,
    quartoCortinaOn: false
  });

  const toast = useRef<Toast>(null);

  const toastShow = (mensagem: string) => {
    toast.current?.show({ severity: 'info', summary: 'Aviso', detail: mensagem });
  };

  useEffect(() => {
    socket.on('estadoInicial', (novoEstado: EstadosDispositivos) => {
      setDispositivo(novoEstado);
    });

    socket.on('estadoAltera', (novoEstado: EstadosDispositivos) => {
      setDispositivo(novoEstado);
    });

    socket.on('mensagemErro', (mensagem: string) => {
      console.log(mensagem);
      toastShow(mensagem);
    });

    return () => {
      socket.off('estadoInicial');
      socket.off('estadoAltera');
      socket.off('mensagemErro');
    }
  });

  //Sala
  const salaTrocarLuz = () => {
    setDispositivo({
      ...dispositivo,
      salaLuzOn: !dispositivo.salaLuzOn
    });

    socket.emit('sala-luz-estado', !dispositivo.salaLuzOn);
  }


  const salaTrocarTv = () => {
    setDispositivo({
      ...dispositivo,
      salaTvOn: !dispositivo.salaTvOn
    });

    socket.emit('sala-tv-estado', !dispositivo.salaTvOn);
  }

  const salaTrocarCanalTV = (e: InputNumberValueChangeEvent) => {
    setDispositivo({
      ...dispositivo,
      salaTvCanal: e.value ?? 0
    });

    socket.emit('sala-tv-canal', e.value);
  }

  const salaTrocarAc = () => {
    setDispositivo({
      ...dispositivo,
      salaAcOn: !dispositivo.salaAcOn
    });

    socket.emit('sala-ac-estado', !dispositivo.salaAcOn);
  }

  const salaTrocarTemperaturaAc = (e: InputNumberValueChangeEvent) => {
    setDispositivo({
      ...dispositivo,
      salaAcTemp: e.value ?? 0
    });

    socket.emit('sala-ac-temperatura', e.value);
  }

  //Cozinha
  const cozinhaTrocarLuz = () => {
    setDispositivo({
      ...dispositivo,
      cozinhaLuzOn: !dispositivo.cozinhaLuzOn
    });

    socket.emit('cozinha-luz-estado', !dispositivo.cozinhaLuzOn);
  }

  const cozinhaTrocarGeladeiraTemp = (e: InputNumberValueChangeEvent) => {
    setDispositivo({
      ...dispositivo,
      cozinhaGeladeiraTemp: e.value ?? 0
    });

    socket.emit('cozinha-geladeira-temperatura', e.value);
  }

  const cozinhaTrocarFogao = () => {
    setDispositivo({
      ...dispositivo,
      cozinhaFogaoOn: !dispositivo.cozinhaFogaoOn
    });

    socket.emit('cozinha-fogao-estado', !dispositivo.cozinhaFogaoOn);
  }

  const cozinhaTrocarPotenciaFogao = (e: InputNumberValueChangeEvent) => {
    setDispositivo({
      ...dispositivo,
      cozinhaFogaoPotencia: e.value ?? 0
    });

    socket.emit('cozinha-fogao-potencia', e.value);
  }

  //Quarto
  const quartoTrocarLuz = () => {
    setDispositivo({
      ...dispositivo,
      quartoLuzOn: !dispositivo.quartoLuzOn
    });

    socket.emit('quarto-luz-estado', !dispositivo.quartoLuzOn);
  }

  const quartoTrocarVentilador = () => {
    setDispositivo({
      ...dispositivo,
      quartoVentiladorOn: !dispositivo.quartoVentiladorOn
    });

    socket.emit('quarto-ventilador-estado', !dispositivo.quartoVentiladorOn);
  }

  const quartoTrocarVelocidadeVentilador = (e: InputNumberValueChangeEvent) => {
    setDispositivo({
      ...dispositivo,
      quartoVentiladorVelocidade: e.value ?? 0
    });

    socket.emit('quarto-ventilador-velocidade', e.value);
  }

  const quartoTrocarCortina = () => {
    setDispositivo({
      ...dispositivo,
      quartoCortinaOn: !dispositivo.quartoCortinaOn
    });

    socket.emit('quarto-cortina-estado', !dispositivo.quartoCortinaOn);
  }

  return (
    <>
      <div >
        <h1>Casa Inteligente</h1>
      </div>

      <Toast ref={toast} />

      <TabView>
        <TabPanel header="Sala " leftIcon="pi pi-tv mr-2">
          <div className="space-y-5">

            <Card title="Luz">
              <div className="space-y-4 flex flex-col items-center">
                <img src="img/lampada.png" className="w-[200px]" alt="" />
                <p>Luz</p>
                <InputSwitch checked={dispositivo.salaLuzOn} onChange={salaTrocarLuz} />
              </div>
            </Card>
            <Card title="TV">
              <div className="space-y-4 flex flex-col items-center">
                <img src="img/tv.png" className="w-[200px]" alt="" />
                <InputSwitch checked={dispositivo.salaTvOn} onChange={salaTrocarTv} />
                <div className="">
                  <label className="font-bold block mb-2">Canal</label>
                  <InputNumber size={1} value={dispositivo.salaTvCanal} onValueChange={salaTrocarCanalTV} showButtons buttonLayout="horizontal"
                    decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
              </div>
            </Card>

            <Card title="Ar-Condicionado">
              <div className="space-y-4 flex flex-col items-center">
                <img src="img/ac.png" className="w-[200px]" alt="" />
                <InputSwitch checked={dispositivo.salaAcOn} onChange={salaTrocarAc} />
                <div className="">
                  <label className="font-bold block mb-2">Temperatura ºC</label>
                  <InputNumber size={1} value={dispositivo.salaAcTemp} onValueChange={salaTrocarTemperaturaAc} showButtons buttonLayout="horizontal"
                    decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
              </div>
            </Card>

          </div>

        </TabPanel>
        <TabPanel header="Cozinha" rightIcon="pi pi-cake ml-2">
          <div className="space-y-5">

            <Card title="Luz">
              <div className="space-y-4 flex flex-col items-center">
                <img src="img/lampada.png" className="w-[200px]" alt="" />
                <p>Luz</p>
                <InputSwitch checked={dispositivo.cozinhaLuzOn} onChange={cozinhaTrocarLuz} />
              </div>
            </Card>
            <Card title="Geladeira">
              <div className="space-y-4 flex flex-col items-center">
                <img src="img/geladeira.png" className="w-[200px]" alt="" />
                <div className="">
                  <label className="font-bold block mb-2">Temperatura</label>
                  <InputNumber size={1} value={dispositivo.cozinhaGeladeiraTemp} onValueChange={cozinhaTrocarGeladeiraTemp} showButtons buttonLayout="horizontal"
                    decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
              </div>
            </Card>

            <Card title="Fogão">
              <div className="space-y-4 flex flex-col items-center">
                <img src="img/fogao.png" className="w-[200px]" alt="" />
                <InputSwitch checked={dispositivo.cozinhaFogaoOn} onChange={cozinhaTrocarFogao} />
                <div className="">
                  <label className="font-bold block mb-2">Potência</label>
                  <InputNumber size={1} value={dispositivo.cozinhaFogaoPotencia} onValueChange={cozinhaTrocarPotenciaFogao} showButtons buttonLayout="horizontal"
                    decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
              </div>
            </Card>

          </div>

        </TabPanel>
        <TabPanel header="Quarto" leftIcon="pi pi-power mr-2" >
          <div className="space-y-5">

            <Card title="Luz">
              <div className="space-y-4 flex flex-col items-center">
                <img src="img/lampada.png" className="w-[200px]" alt="" />
                <p>Luz</p>
                <InputSwitch checked={dispositivo.quartoLuzOn} onChange={quartoTrocarLuz} />
              </div>
            </Card>
            <Card title="Ventilador">
              <div className="space-y-4 flex flex-col items-center">
                <img src="img/ventilador.png" className="w-[200px]" alt="" />
                <InputSwitch checked={dispositivo.quartoVentiladorOn} onChange={quartoTrocarVentilador} />
                <div className="">
                  <label className="font-bold block mb-2">Velocidade</label>
                  <InputNumber size={1} value={dispositivo.quartoVentiladorVelocidade} onValueChange={quartoTrocarVelocidadeVentilador} showButtons buttonLayout="horizontal"
                    decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
              </div>
            </Card>

            <Card title="Cortina">
              <div className="space-y-4 flex flex-col items-center">
                <img src="img/cortina.png" className="w-[200px]" alt="" />
                <p>Cortina</p>
                <InputSwitch checked={dispositivo.quartoCortinaOn} onChange={quartoTrocarCortina} />
              </div>
            </Card>

          </div>
        </TabPanel>
      </TabView >
    </>
  );
}

export default App;
