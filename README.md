This tool helps keep track of the weather based on the system in Raiders of the Serpant Sea by Arcanum Worlds

## For DMs
![image](https://github.com/user-attachments/assets/74577fcb-dd99-49f4-931e-f6774c4f9bf2)

DMs will see the weather tracker with dots indicating the current weather. Plus they will be able to modify the weather based on the in game roll tables. When they do, a weather report will output to chat for the DM only listing the number rolled and how that table was modified

![image](https://github.com/user-attachments/assets/d03f6ac6-ca36-4525-9915-2afcc6ff3175)

Under game settings, DMs can also manually modify the weather and if they want to see the weather report

## For Players
![image](https://github.com/user-attachments/assets/f8a8b0c3-b405-453b-a777-f12716761768)

Players will only be able to see the weather and not Modify it.

![image](https://github.com/user-attachments/assets/50dc8e4d-88a4-4ab1-8c82-cf45348015a8)
They will be allowed to choose if they see the weather tracker when they load into Foundry

![image](https://github.com/user-attachments/assets/430bf991-b6cc-4f38-8339-3d910c16281c)
Both Players and GMs will be able to open the weather tracker on the side bar

## Weather Tracker API
![image](https://github.com/user-attachments/assets/39864ef5-44a0-49fc-9aeb-a76b5410b56d)

This module has a small API that can be accessed. 
### getPos
this function gets an array of where each indicator is at 0 for on the very top and 6 for at the very bottom

### openApp
this function opens the weather tracker

### updatePos
this function allows you to modify the weather via a macro. Only the GM can modify it. You can use Advanced-Macros to allow players to run a macro as the GM
