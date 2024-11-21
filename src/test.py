import pygame
# Initialize pygame
pygame.init()

# Set up the game window
window_width = 300
window_height = 300
window = pygame.display.set_mode((window_width, window_height))
pygame.display.set_caption("Tic Tac Toe")

# Define colors
black = (0, 0, 0)
white = (255, 255, 255)

# Define the board
board = [['', '', ''],
         ['', '', ''],
         ['', '', '']]

# Define the players
player1 = 'X'
player2 = 'O'
current_player = player1

# Define the font
font = pygame.font.Font(None, 100)

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN:
            # Get the position of the mouse click
            mouse_x, mouse_y = pygame.mouse.get_pos()

            # Calculate the cell position based on the mouse click
            cell_x = mouse_x // (window_width // 3)
            cell_y = mouse_y // (window_height // 3)

            # Check if the cell is empty
            if board[cell_y][cell_x] == '':
                # Update the board with the current player's symbol
                board[cell_y][cell_x] = current_player

                # Switch to the next player
                if current_player == player1:
                    current_player = player2
                else:
                    current_player = player1

    # Clear the window
    window.fill(white)

    # Draw the board
    for row in range(3):
        for col in range(3):
            cell_value = board[row][col]
            cell_text = font.render(cell_value, True, black)
            cell_rect = cell_text.get_rect(center=((col * (window_width // 3)) + (window_width // 6),
                                                    (row * (window_height // 3)) + (window_height // 6)))
            pygame.draw.rect(window, white, ((col * (window_width // 3)), (row * (window_height // 3)),
                                              (window_width // 3), (window_height // 3)))
            window.blit(cell_text, cell_rect)

    # Update the display
    pygame.display.update()

# Quit the game
pygame.quit()
