import os

images = sorted(os.listdir('extracted_diagrams'))
for img in images:
    print(img)
