# Report do Teste da IDGeo

_Detalhes das alterações feitas para atender ao objetivo 3 do teste prático_

Será descrito o raciocínio para realizar objetivo 3 conforme descrito do README.md.

## Análise da Abordagem

* Como associar os eventos aos métodos de desenhar pontos.
* Como realizar a promise e desenhar todos os pontos na tela.

## Descrição da Abordagem

* Foram criados os métodos __renderPointsFiltro__ e __clearPoints__

	* O Método __renderPointsFiltro__ leva um parâmetro _Booleano_ que permite
    definir quais os pontos serão desenhados no mapa com o uso do método
    __contains__ já implementado na classe _Map_.

    * O Método __clearPoints__ remove os pontos exibidos na tela para poder
    colocar os pontos de acordo com a função definida para cada botão.

        1. Botão MOSTRA TODOS: remove todos pontos e em seguida mostra todos
        os pontos com __renderPoints__;

        2. Botão MOSTRAR PONTOS NO MAPA: remove todos os pontos em seguinda
        exibe somente os pontos que estão dentro do mapa com
        __renderPointsFiltro(true)__;

        3. Botão MOSTRAR APENAS PONTOS FORA DO MAPA: remove todos os pontos 
        em seguinda exibe somente os pontos que estão fora do mapa com
        __renderPointsFiltro(false)__.

* Na classe _Controller_ o método __renderPoints__ foi implementado para
realizar a promise que reúne os dados do arquivo _data.json_ e exibi-los
por meio do __drawPoint__ já implementado.


## Resultados Obtidos

* O objetivo foi alcançado conforme descrito no teste prático.


## Conclusão

* A solução por meio do promise se mostrou útil devido a possibilidade
de haver um atraso de carregamento dos dados. Isso mostra que é muito
importante promover o uso fluido das aplicações por parte do usuário através
de tecnologicas assícronas e com a possiblidade de desenvolvimento com código
paralelizável. 