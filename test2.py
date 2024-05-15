vertices = [

    ]

new_vertices = []
for vertex in vertices:
    new_vertices.append([vertex[0], vertex[1], vertex[2]])

# 6개씩 끊어서 출력
for i in range(0, len(new_vertices), 6):
    print(new_vertices[i:i+6], " //--")