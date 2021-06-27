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

    // this.renderPoints();
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
    // Limpa todos os pontos desenhados na tela
    this.clearPoints();
    // Desenha todos os pontos novamente na tela
    this.renderPoints();
  }

  btnFiltroInsideClick = () => {
    // Evento de clique do botão de filtro "Mostrar apenas do mapa"
    document.querySelector('.button.selected')?.classList.remove('selected');
    document.querySelector('#btn-filtro-inside').classList.add('selected');
    // Limpa todos os pontos desenhados na tela
    this.clearPoints();
    // Desenha os pontos que estão dentro do mapa
    this.renderPointsFiltro(true);
  }

  btnFiltroOutsideClick = () => {
    // Evento de clique do botão de filtro "Mostrar apenas pontos fora do mapa"
    document.querySelector('.button.selected')?.classList.remove('selected');
    document.querySelector('#btn-filtro-outside').classList.add('selected');
    // Limpa todos os pontos desenhados na tela
    this.clearPoints();
    // Desenha os pontos que estão fora do mapa
    this.renderPointsFiltro(false);
  }
  
  /**  Renderiza os pontos carregados no Mapa */
  renderPoints() {

  //  Retorna a promise que reúne os dados do arquivo data.json
    this.map.getPoints().then(
      response => {
        if (response.length > 1) {
          this.map.points = response;
        } else {
          this.map.points = response.points;
        }
        // Se houver pontos adiciona eles com drawPoint
        if (this.map.points.length > 0) {
          // Percorre toda a relação de pontos
          this.map.points.forEach(point => {
              // Desenha o ponto
            this.drawPoint(point);
          });
        }
      }
    );
  }

  /**
   * Desenha os pontos de dentro ou de fora dependendo do parâmetro passado
   * @param {Boolean} lado Especifica se o ponto vai ser desenhado dentro 
   * ou fora se for, respecvamente true ou false.
   */
  renderPointsFiltro(lado) {
    //  Retorna a promise que reúne os dados do arquivo data.json 
    this.map.getPoints().then(
      response => {
        if (response.length > 1) {
          this.map.points = response;
        } else {
          this.map.points = response.points;
        }
        // Se houver pontos adiciona eles com drawPoint
        if (this.map.points.length > 0) {
          // Percorre toda a relação de pontos
          this.map.points.forEach(point => {
            // É feito o desenho se o ponto está conforme o parâmetro
            if (this.map.contains(point) === lado) {
              // Desenha o ponto
              this.drawPoint(point); 
            }
          });
        }
      }
    );
  }

  /**
   * O método remove todos os pontos desenhados
   */
  clearPoints(){
    // Identifica todos os pontos desenhados e reune eles em uma lista
    var points = document.getElementsByClassName('map__point');
    // Remove todos os pontos um a um
    while(points.length > 0) {
      points[0].parentNode.removeChild(points[0]);
    }
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
