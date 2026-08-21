# Kessel Run: Pyke Syndicate Simulator

Simulador de logística, economía galáctica y cálculo de rutas de contrabando
inspirado en Star Wars. React + TypeScript + Zustand + Tailwind CSS.

## Instalación

```bash
npm install
npm run dev       # entorno de desarrollo
npm run build     # build de producción (dist/)
```

## Arquitectura

```
src/
  types/game.ts         Interfaces del dominio (Planet, Starship, RouteNode, etc.)
  data/planets.ts        Base de datos estática de los 4 nodos galácticos
  data/bountyHunters.ts  Roster de cazadores de recompensas de la Cantina
  utils/routeEngine.ts   Motor matemático: distancia vectorial + probabilidad
                          combinada de interceptación/peligro espacial
  store/gameStore.ts     Store Zustand: estado global, acciones y la máquina
                          de estados de viaje (IDLE → IN_TRANSIT →
                          INTERCEPTED → ARRIVED)
  components/
    SidebarStatus.tsx     Créditos, vitales de la nave, medidor de Calor Imperial
    GalaxyMap.tsx          Selector de destino + análisis de rutas
    RouteAnalysis.tsx      Desglose de coeficientes de riesgo por ruta
    TerminalConsole.tsx    Log de consola (memoizado para evitar re-renders)
    TradePanel.tsx         Compra/venta de mercancía por volumen
    ShipUpgrades.tsx       Mejoras de hipermotor y escudos
    Cantina.tsx             Contratación de cazadores de recompensas
    CrisisModal.tsx         Eventos aleatorios de crisis (bloqueantes)
    GameOverScreen.tsx      Pantalla de victoria/derrota + estadísticas
```

## Algoritmos clave

- **Distancia vectorial**: `sqrt((x2-x1)² + (y2-y1)²)` entre planetas en el
  plano cartesiano galáctico (`routeEngine.ts`).
- **Riesgo combinado**: cada ruta pondera el índice de ley del destino y el
  peligro espacial natural según su perfil (Comercial / Contrabando / Atajo),
  amplificado por el Calor Imperial acumulado del jugador.
- **Probabilidad de fallo del viaje**: se tratan interceptación y peligro
  espacial como eventos independientes: `P(fallo) = 1 - (1-Pa)(1-Pb)`.
- **Mitigación de cazadores de recompensas**: `combatPower / 100` reduce
  proporcionalmente el daño de casco y los costos de soborno/peaje durante
  una crisis activa.

## Extensiones sugeridas

- Persistir el estado con el middleware `persist` de Zustand.
- Fluctuación de precios de mercado en tiempo real vía `setInterval` sobre
  `basePrice` con ruido aleatorio y eventos de galaxia.
- Animación de la nave sobre el mapa cartesiano en `<GalaxyMap />` usando
  las coordenadas X/Y ya definidas en `Planet`.
