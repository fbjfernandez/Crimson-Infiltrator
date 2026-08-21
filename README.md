🚀 Crimson Infiltrator: Core Intelligence Engine

> Un simulador de gestión de recursos y estrategia basado en eventos. El proyecto está enfocado en la aplicación de patrones de diseño limpios, separación de responsabilidades (SoC) y una arquitectura Full Stack robusta orientada a transacciones en tiempo real.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## 🏗️ Architecture & Tech Stack

El sistema opera bajo un modelo de tres capas, delegando el procesamiento pesado y la validación matemática al servidor para mantener un cliente ligero y seguro contra vulnerabilidades.

*   **Frontend (Presentación):** Construido con React y TypeScript. Implementa tipado estricto para bloquear estados inválidos en tiempo de compilación y optimiza el ciclo de vida de la UI utilizando Zustand con selectores atómicos.
*   **Backend (Lógica de Negocio):** Microservicio RESTful desarrollado en Python con FastAPI. Centraliza el motor predictivo de economía y la resolución probabilística de los eventos.
*   **Base de Datos (Persistencia):** Integración relacional con PostgreSQL (Supabase) para garantizar la integridad de las sesiones, evitar manipulaciones en el cliente y asegurar los datos de los usuarios.

---

## ⚙️ Core Systems & Logic

La simulación gira en torno a motores de reglas de negocio interconectados:

*   **Dynamic Pricing Engine:** El backend en Python altera el valor del mercado calculando penalizaciones por saturación (oferta y demanda) y modificadores regionales basados en el contexto narrativo de cada planeta.
*   **Event Resolution:** Algoritmos del servidor que cruzan las variables de estado del jugador (como el nivel de *Imperial Heat*) para calcular probabilidades de éxito y generar consecuencias operacionales.
*   **Resource State Management:** Control estricto de recursos clave como Créditos, Combustible, Integridad del Casco y Niveles de Infiltración.

---

## 🛠️ Roadmap & Future AI Integration

El proyecto se encuentra en una transición activa hacia una infraestructura de microservicios inteligente:

*   [ ] Migración del estado local (Zustand) hacia el motor de validación central en FastAPI.
*   [ ] Implementación de modelos de Machine Learning (Scikit-Learn) en el backend para predecir fluctuaciones del mercado basadas en el historial del jugador.
*   [ ] Desarrollo de un agente conversacional (NLP) que actúe como informante dinámico dentro de la simulación.

---

## 👨‍💻 Autor

**Fernando Benito Joaquin Fernandez Navarrete**
*Estudiante de Ingeniería de Sistemas | Desarrollador Front-End*