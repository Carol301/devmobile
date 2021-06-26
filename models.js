/**
 * Classe responsável por controlar informações de um mapa.
 */
export class Map {

  constructor(name, bbox) {
    if (!Array.isArray(bbox) || bbox.length !== 4)
      throw "Erro: a propriedade bbox deve ser uma array com 4 pontos! [[x, y], [x, y], [x, y], [x, y]]"
    //  Nome do mapa.
    this.name = name;
    //  Bounding box com 4 pontos que montam um quadrilátero contendo todo o mapa dentro de si.
    this.boudingBox = bbox;
    //  Lista de pontos carregados
    this.points = [];
    //  Endereço do arquivo json contendo os pontos do mapa
    this.dataURL = "data.json";
  }

  /**
   * Carrega os pontos do mapa contidos em um arquivo .json e retorna uma promise
   * @return promise Promise que resolverá quando os dados estiverem prontos para serem usados
  */
  getPoints() {
    return new Promise((resolve, reject) => {
      //  Retorna os pontos do mapa caso já estejam carregados
      if (this.points.length !== 0) resolve(this.points);
      //  Ou faz uma requisição para o arquivo JSON
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            this.points = JSON.parse(xhttp.responseText);
             resolve(this.points);
          }
      };
      xhttp.open("GET", this.dataURL, true);
      xhttp.send();
    });
  }

  /**
   * Calcula se um dado ponto está contido na bouding box do mapa
   * @param object ponto a ser verificado
   * @return boolean
   */
  contains(point) {
    let contido = false
    for (let i = 0, j = this.boudingBox.length - 1; i < this.boudingBox.length; j = i++) {
      const xi = this.boudingBox[i][0];
      const yi = this.boudingBox[i][1];
      const xj = this.boudingBox[j][0];
      const yj = this.boudingBox[j][1];
      const inter = ((yi > point.y) !== (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (inter) contido = !contido;
    }
    return contido;
  }
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

/**
 * Classe responsável por controlar a tela da aplicação.
 */
export class Controller {
  constructor(id) {
    //  Registra o ID do SVG
    this.id = id;
    //  Cria uma referência para o objeto SVG no DOM
    this.mapObject = document.querySelector(id);
    if (this.mapObject === null)
      throw `Erro: mapa com seletor ${id} não encontrado.`
    //  Instancia um novo Mapa com alguns dados
    this.map = new Map('Pontos', [[130, 30], [370, 30], [370, 270], [130, 270]]);
  }

  /**
   * Função responsável por posicionar os objetos inicialmente na tela e
   * registrar eventos.
   */
  init() {
    this.mapObject.setAttribute('width', '500');
    this.mapObject.setAttribute('height', '300');
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    let points = '';
    for (const point of this.map.boudingBox) {
      points += point.join(',') + ' ';
    }
    polygon.classList.add('bbox');
    polygon.setAttribute('points', points);
    this.mapObject.appendChild(polygon);

    this.addEvents();

    this.renderPoints();
  }

  /** Registra eventos de cliques para os botões de filtro */
  addEvents() {
    document.querySelector('#btn-filtro-todos').addEventListener('click', this.btnFiltroTodosClick);
    document.querySelector('#btn-filtro-inside').addEventListener('click', this.btnFiltroInsideClick);
    document.querySelector('#btn-filtro-outside').addEventListener('click', this.btnFiltroOutsideClick);
  }

  btnFiltroTodosClick = () => {
    // Evento de clique do botão de filtro "Mostrar todos"
    document.querySelector('.button.selected')?.classList.remove('selected');
    document.querySelector('#btn-filtro-todos').classList.add('selected');
  }

  btnFiltroInsideClick = () => {
    // Evento de clique do botão de filtro "Mostrar apenas do mapa"
    document.querySelector('.button.selected')?.classList.remove('selected');
    document.querySelector('#btn-filtro-inside').classList.add('selected');
  }

  btnFiltroOutsideClick = () => {
    // Evento de clique do botão de filtro "Mostrar apenas pontos fora do mapa"
    document.querySelector('.button.selected')?.classList.remove('selected');
    document.querySelector('#btn-filtro-outside').classList.add('selected');
  }

  /**  Renderiza os pontos carregados no Mapa */
  renderPoints() {
    //   PROGRAME AQUI :)
  }

  /**
   * Desenha um ponto no formato {x, y} na tela
   * @param object objeto contendo as coordenadas x e y do ponto
   */
  drawPoint(point) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    let points = '';
    for (const point of this.map.boudingBox) {
      points += point.join(',') + ' ';
    }
    //  Adiciona uma classe de referência para o ponto
    circle.classList.add('map__point');
    //  Seta o atributo x do círculo
    circle.setAttribute('cx', point.x);
    //  Seta o atributo y do círculo
    circle.setAttribute('cy', point.y);
    //  Seta o raio do círculo em 5
    circle.setAttribute('r', 5);
    circle.setAttribute('fill', 'black');
    //  Adiciona o novo ponto ao SVG
    this.mapObject.appendChild(circle);
  }
}
