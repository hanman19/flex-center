import os
import re

# TopNav를 안전하게 추가 - 기존 코드 절대 안 지움! 2줄만 추가!
pages = [
    "src/app/dashboard/page.tsx",
    "src/app/products/page.tsx",
    "src/app/wms/page.tsx",
    "src/app/orders/page.tsx",
    "src/app/platforms/page.tsx",
    "src/app/admin/wms/page.tsx",
]

for path in pages:
    if not os.path.exists(path):
        print(f"없음: {path}")
        continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if 'TopNav' in content and '<TopNav' in content:
        print(f"이미 있음: {path}")
        continue
    
    # 1. import 추가 - "use client"; 다음 줄에 추가 (없으면 맨 위에)
    if 'import TopNav' not in content:
        if '"use client";' in content:
            content = content.replace('"use client";', '"use client";\nimport TopNav from "@/components/TopNav";')
        elif "'use client';" in content:
            content = content.replace("'use client';", "'use client';\nimport TopNav from \"@/components/TopNav\";")
        else:
            # use client 없으면 맨 위에
            content = 'import TopNav from "@/components/TopNav";\n' + content
    
    # 2. <TopNav /> 추가 - <div className="min-h-screen..."> 바로 뒤에
    # 이미 <TopNav />가 없으면 첫 번째 min-h-screen div 뒤에 추가
    if '<TopNav' not in content:
        # 패턴 1: <div className="min-h-screen ...">
        match = re.search(r'(<div className="min-h-screen[^>]*>)', content)
        if match:
            content = content.replace(match.group(1), match.group(1) + '\n      <TopNav />', 1)
        else:
            # 패턴 2: return ( 바로 뒤에
            content = re.sub(r'(return\s*\(\s*\n)', r'\1      <TopNav />\n', content, count=1)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"✅ 완료: {path} - TopNav 2줄 추가됨, 기존 코드 그대로!")

print("\n끝! 모든 페이지에 TopNav 추가됨! 기존 코드는 그대로!")
print("이제 git add . && git commit -m 'add TopNav safely' && git push 하면 메뉴가 모든 페이지에 고정!")
