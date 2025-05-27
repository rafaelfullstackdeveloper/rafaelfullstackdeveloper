#!/usr/bin/env python3
"""
Simulador de Fogos de Artifício 3D
Controles:
- Mouse: Rotacionar câmera
- Scroll: Zoom
- Tecla 'f': Disparar fogos de artifício
- Teclas '+'/'-': Aumentar/diminuir tamanho das explosões
- Tecla 'b': Trocar plano de fundo
- Tecla 'c': Trocar cores
- Tecla 'r': Reset da câmera
- Tecla 'q': Sair
"""

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.animation as animation
from matplotlib.widgets import Button, Slider
import random
import math
import os
from PIL import Image
import tkinter as tk
from tkinter import filedialog

class Firework:
    def __init__(self, x, y, z, color, size_factor=1.0):
        self.origin = np.array([x, y, z])
        self.color = color
        self.size_factor = size_factor
        self.particles = []
        self.age = 0
        self.max_age = 100
        self.exploded = False
        self.explosion_age = 0
        self.create_trail()

    def create_trail(self):
        """Criar rastro do foguete subindo"""
        self.trail_points = []
        height = self.origin[2]
        for i in range(20):
            y_pos = i * height / 20
            x_noise = random.uniform(-0.5, 0.5)
            z_noise = random.uniform(-0.5, 0.5)
            self.trail_points.append([
                self.origin[0] + x_noise,
                y_pos,
                self.origin[2] + z_noise
            ])

    def explode(self):
        """Criar explosão com partículas"""
        if self.exploded:
            return

        self.exploded = True
        num_particles = int(150 * self.size_factor)

        # Diferentes padrões de explosão
        patterns = ['sphere', 'ring', 'heart', 'spiral', 'burst']
        pattern = random.choice(patterns)

        if pattern == 'sphere':
            self.create_sphere_explosion(num_particles)
        elif pattern == 'ring':
            self.create_ring_explosion(num_particles)
        elif pattern == 'heart':
            self.create_heart_explosion(num_particles)
        elif pattern == 'spiral':
            self.create_spiral_explosion(num_particles)
        else:
            self.create_burst_explosion(num_particles)

    def create_sphere_explosion(self, num_particles):
        """Explosão esférica"""
        for _ in range(num_particles):
            # Distribuição esférica uniforme
            theta = random.uniform(0, 2 * math.pi)
            phi = random.uniform(0, math.pi)
            velocity = random.uniform(3, 8) * self.size_factor

            vx = velocity * math.sin(phi) * math.cos(theta)
            vy = velocity * math.sin(phi) * math.sin(theta)
            vz = velocity * math.cos(phi)

            particle = {
                'pos': self.origin.copy(),
                'vel': np.array([vx, vy, vz]),
                'color': self.vary_color(),
                'life': random.uniform(40, 80),
                'gravity': -0.1,
                'fade': random.uniform(0.95, 0.99)
            }
            self.particles.append(particle)

    def create_ring_explosion(self, num_particles):
        """Explosão em anel"""
        for _ in range(num_particles):
            angle = random.uniform(0, 2 * math.pi)
            velocity = random.uniform(4, 7) * self.size_factor
            height_var = random.uniform(-1, 1) * self.size_factor

            vx = velocity * math.cos(angle)
            vy = height_var
            vz = velocity * math.sin(angle)

            particle = {
                'pos': self.origin.copy(),
                'vel': np.array([vx, vy, vz]),
                'color': self.vary_color(),
                'life': random.uniform(50, 90),
                'gravity': -0.08,
                'fade': random.uniform(0.96, 0.99)
            }
            self.particles.append(particle)

    def create_heart_explosion(self, num_particles):
        """Explosão em formato de coração"""
        for _ in range(num_particles):
            t = random.uniform(0, 2 * math.pi)
            # Equação paramétrica do coração
            x = 16 * math.sin(t)**3
            y = 13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t)

            scale = 0.3 * self.size_factor
            velocity = random.uniform(2, 5)

            vx = x * scale * velocity / 20
            vy = random.uniform(-2, 4) * self.size_factor
            vz = y * scale * velocity / 20

            particle = {
                'pos': self.origin.copy(),
                'vel': np.array([vx, vy, vz]),
                'color': [1.0, 0.2, 0.4],  # Cor rosa/vermelha para coração
                'life': random.uniform(60, 100),
                'gravity': -0.05,
                'fade': random.uniform(0.97, 0.99)
            }
            self.particles.append(particle)

    def create_spiral_explosion(self, num_particles):
        """Explosão em espiral"""
        for i in range(num_particles):
            t = i * 0.1
            radius = (i / num_particles) * 5 * self.size_factor

            vx = radius * math.cos(t) * 0.5
            vy = random.uniform(2, 6) * self.size_factor
            vz = radius * math.sin(t) * 0.5

            particle = {
                'pos': self.origin.copy(),
                'vel': np.array([vx, vy, vz]),
                'color': self.vary_color(),
                'life': random.uniform(70, 110),
                'gravity': -0.06,
                'fade': random.uniform(0.97, 0.99)
            }
            self.particles.append(particle)

    def create_burst_explosion(self, num_particles):
        """Explosão em rajada"""
        for _ in range(num_particles):
            angle_xy = random.uniform(0, 2 * math.pi)
            angle_z = random.uniform(-math.pi/4, math.pi/4)
            velocity = random.uniform(5, 12) * self.size_factor

            vx = velocity * math.cos(angle_xy) * math.cos(angle_z)
            vy = velocity * math.sin(angle_z)
            vz = velocity * math.sin(angle_xy) * math.cos(angle_z)

            particle = {
                'pos': self.origin.copy(),
                'vel': np.array([vx, vy, vz]),
                'color': self.vary_color(),
                'life': random.uniform(30, 70),
                'gravity': -0.12,
                'fade': random.uniform(0.94, 0.98)
            }
            self.particles.append(particle)

    def vary_color(self):
        """Variar cor base para criar efeito mais realista"""
        base_color = np.array(self.color)
        variation = np.random.uniform(-0.3, 0.3, 3)
        new_color = base_color + variation
        return np.clip(new_color, 0, 1)

    def update(self):
        """Atualizar estado do foguete e partículas"""
        self.age += 1

        # Se não explodiu ainda, explodir quando chegar ao ponto
        if not self.exploded and self.age > 30:
            self.explode()

        # Atualizar partículas da explosão
        if self.exploded:
            self.explosion_age += 1
            alive_particles = []

            for particle in self.particles:
                # Atualizar posição
                particle['pos'] += particle['vel']

                # Aplicar gravidade
                particle['vel'][1] += particle['gravity']

                # Aplicar resistência do ar
                particle['vel'] *= 0.98

                # Diminuir vida
                particle['life'] -= 1

                # Aplicar fade
                particle['color'] = [c * particle['fade'] for c in particle['color']]

                if particle['life'] > 0:
                    alive_particles.append(particle)

            self.particles = alive_particles

        return len(self.particles) > 0 or not self.exploded

class FireworkShow:
    def __init__(self):
        # Configurar figura
        plt.style.use('dark_background')
        self.fig = plt.figure(figsize=(14, 10))
        self.ax = self.fig.add_subplot(111, projection='3d')

        # Estado
        self.fireworks = []
        self.size_factor = 1.0
        self.background_image = None
        self.color_schemes = [
            [1, 0.5, 0],      # Laranja
            [1, 0, 0],        # Vermelho
            [0, 1, 0],        # Verde
            [0, 0, 1],        # Azul
            [1, 1, 0],        # Amarelo
            [1, 0, 1],        # Magenta
            [0, 1, 1],        # Ciano
            [1, 1, 1],        # Branco
        ]
        self.current_color_index = 0

        # Configurar visualização
        self.setup_plot()
        self.setup_controls()

        # Configurar eventos
        self.fig.canvas.mpl_connect('key_press_event', self.on_key_press)
        self.fig.canvas.mpl_connect('button_press_event', self.on_mouse_click)

        # Iniciar animação
        self.animation = animation.FuncAnimation(
            self.fig, self.animate, interval=50, blit=False
        )

    def setup_plot(self):
        """Configurar aparência do gráfico"""
        self.ax.set_xlim([-20, 20])
        self.ax.set_ylim([0, 40])
        self.ax.set_zlim([-20, 20])

        self.ax.set_xlabel('X')
        self.ax.set_ylabel('Y (Altura)')
        self.ax.set_zlabel('Z')

        # Configurar cor de fundo
        self.ax.xaxis.pane.fill = False
        self.ax.yaxis.pane.fill = False
        self.ax.zaxis.pane.fill = False

        # Tornar grade mais sutil
        self.ax.grid(True, alpha=0.3)

        # Título
        self.ax.set_title('🎆 Simulador de Fogos de Artifício 3D 🎆\n' +
                         'Pressione "f" para disparar | "+/-" para tamanho | "b" para fundo',
                         fontsize=14, pad=20)

    def setup_controls(self):
        """Configurar controles da interface"""
        # Área para controles
        plt.subplots_adjust(bottom=0.15)

        # Botão para disparar fogos
        ax_fire = plt.axes([0.1, 0.05, 0.15, 0.04])
        self.btn_fire = Button(ax_fire, 'Disparar (F)')
        self.btn_fire.on_clicked(self.fire_firework_btn)

        # Botão para carregar imagem de fundo
        ax_bg = plt.axes([0.3, 0.05, 0.15, 0.04])
        self.btn_bg = Button(ax_bg, 'Fundo (B)')
        self.btn_bg.on_clicked(self.load_background_btn)

        # Slider para tamanho
        ax_size = plt.axes([0.5, 0.05, 0.2, 0.04])
        self.slider_size = Slider(ax_size, 'Tamanho', 0.5, 3.0, valinit=1.0)
        self.slider_size.on_changed(self.update_size)

        # Botão para trocar cor
        ax_color = plt.axes([0.75, 0.05, 0.15, 0.04])
        self.btn_color = Button(ax_color, 'Cor (C)')
        self.btn_color.on_clicked(self.change_color_btn)

    def on_key_press(self, event):
        """Lidar com teclas pressionadas"""
        if event.key == 'f':
            self.fire_firework()
        elif event.key == '+' or event.key == '=':
            self.size_factor = min(3.0, self.size_factor + 0.2)
            self.slider_size.set_val(self.size_factor)
        elif event.key == '-':
            self.size_factor = max(0.5, self.size_factor - 0.2)
            self.slider_size.set_val(self.size_factor)
        elif event.key == 'b':
            self.load_background()
        elif event.key == 'c':
            self.change_color()
        elif event.key == 'r':
            self.reset_camera()
        elif event.key == 'q':
            plt.close('all')

    def on_mouse_click(self, event):
        """Disparar foguete onde clicar"""
        if event.inaxes == self.ax and event.dblclick:
            # Converter coordenadas do clique para 3D (aproximação)
            x = random.uniform(-15, 15)
            z = random.uniform(-15, 15)
            y = random.uniform(20, 35)

            color = self.color_schemes[self.current_color_index]
            firework = Firework(x, y, z, color, self.size_factor)
            self.fireworks.append(firework)

    def fire_firework(self):
        """Disparar um novo foguete"""
        x = random.uniform(-15, 15)
        y = random.uniform(20, 35)
        z = random.uniform(-15, 15)

        color = self.color_schemes[self.current_color_index]
        firework = Firework(x, y, z, color, self.size_factor)
        self.fireworks.append(firework)

    def fire_firework_btn(self, event):
        """Disparar foguete via botão"""
        self.fire_firework()

    def load_background(self):
        """Carregar imagem de fundo"""
        try:
            root = tk.Tk()
            root.withdraw()  # Ocultar janela principal

            file_path = filedialog.askopenfilename(
                title="Selecionar imagem de fundo",
                filetypes=[
                    ("Imagens", "*.png *.jpg *.jpeg *.bmp *.gif"),
                    ("Todos os arquivos", "*.*")
                ]
            )

            if file_path:
                # Carregar e redimensionar imagem
                img = Image.open(file_path)
                img = img.resize((400, 300))
                self.background_image = np.array(img)

                # Aplicar imagem como fundo
                self.ax.xaxis.pane.fill = True
                self.ax.yaxis.pane.fill = True
                self.ax.zaxis.pane.fill = True

                print(f"Fundo carregado: {os.path.basename(file_path)}")

            root.destroy()

        except Exception as e:
            print(f"Erro ao carregar imagem: {e}")

    def load_background_btn(self, event):
        """Carregar fundo via botão"""
        self.load_background()

    def change_color(self):
        """Trocar esquema de cores"""
        self.current_color_index = (self.current_color_index + 1) % len(self.color_schemes)
        color_names = ['Laranja', 'Vermelho', 'Verde', 'Azul', 'Amarelo', 'Magenta', 'Ciano', 'Branco']
        print(f"Cor alterada para: {color_names[self.current_color_index]}")

    def change_color_btn(self, event):
        """Trocar cor via botão"""
        self.change_color()

    def update_size(self, val):
        """Atualizar fator de tamanho"""
        self.size_factor = val

    def reset_camera(self):
        """Resetar posição da câmera"""
        self.ax.view_init(elev=20, azim=45)
        self.fig.canvas.draw()

    def animate(self, frame):
        """Função de animação"""
        self.ax.clear()
        self.setup_plot()

        # Atualizar e renderizar fogos de artifício
        active_fireworks = []

        for firework in self.fireworks:
            still_active = firework.update()

            # Desenhar rastro se não explodiu
            if not firework.exploded:
                trail = np.array(firework.trail_points[:firework.age])
                if len(trail) > 1:
                    self.ax.plot(trail[:, 0], trail[:, 1], trail[:, 2],
                               color=firework.color, alpha=0.7, linewidth=2)

            # Desenhar partículas da explosão
            if firework.exploded and firework.particles:
                positions = np.array([p['pos'] for p in firework.particles])
                colors = [p['color'] for p in firework.particles]
                sizes = [max(10, p['life'] * 0.5) for p in firework.particles]

                # Criar scatter plot com cores variadas
                for i, (pos, color, size) in enumerate(zip(positions, colors, sizes)):
                    self.ax.scatter(pos[0], pos[1], pos[2],
                                  c=[color], s=size, alpha=0.8)

            if still_active:
                active_fireworks.append(firework)

        self.fireworks = active_fireworks

        # Adicionar informações na tela
        info_text = f"Fogos ativos: {len(self.fireworks)}\n"
        info_text += f"Tamanho: {self.size_factor:.1f}\n"
        info_text += f"Cor: {['Laranja', 'Vermelho', 'Verde', 'Azul', 'Amarelo', 'Magenta', 'Ciano', 'Branco'][self.current_color_index]}"

        self.ax.text2D(0.02, 0.98, info_text, transform=self.ax.transAxes,
                      fontsize=10, verticalalignment='top',
                      bbox=dict(boxstyle='round', facecolor='black', alpha=0.7))

        return []

    def show(self):
        """Mostrar a simulação"""
        print("🎆 Simulador de Fogos de Artifício 3D iniciado!")
        print("\nControles:")
        print("- Pressione 'f' para disparar fogos de artifício")
        print("- Use '+' e '-' para ajustar o tamanho")
        print("- Pressione 'b' para carregar imagem de fundo")
        print("- Pressione 'c' para trocar cores")
        print("- Pressione 'r' para resetar câmera")
        print("- Pressione 'q' para sair")
        print("- Clique duplo no gráfico para disparar foguete")

        plt.show()

def create_sample_backgrounds():
    """Criar algumas imagens de fundo de exemplo"""
    backgrounds_dir = "backgrounds"
    if not os.path.exists(backgrounds_dir):
        os.makedirs(backgrounds_dir)

    # Criar gradiente de céu noturno
    width, height = 400, 300

    # Céu estrelado
    night_sky = np.zeros((height, width, 3))
    for _ in range(100):  # Adicionar estrelas
        x, y = random.randint(0, width-1), random.randint(0, height//2)
        brightness = random.uniform(0.5, 1.0)
        night_sky[y, x] = [brightness, brightness, brightness]

    # Gradiente do céu
    for y in range(height):
        intensity = 1 - (y / height) * 0.9
        night_sky[y, :, 0] *= intensity * 0.1  # Pouco vermelho
        night_sky[y, :, 1] *= intensity * 0.1  # Pouco verde
        night_sky[y, :, 2] *= intensity * 0.3  # Mais azul

    # Salvar imagem
    night_sky_img = Image.fromarray((night_sky * 255).astype(np.uint8))
    night_sky_img.save(os.path.join(backgrounds_dir, "night_sky.png"))

    print(f"Imagem de exemplo criada em: {backgrounds_dir}/night_sky.png")

if __name__ == "__main__":
    # Criar imagens de exemplo
    create_sample_backgrounds()

    # Iniciar simulação
    show = FireworkShow()
    show.show()