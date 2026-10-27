import os, re

pages = ["src/app/wms/page.tsx", "src/app/platforms/page.tsx"]

for path in pages:
    if not os.path.exists(path):
        print(f"없음 {path}")
        continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # import 있으면 제거하고 다시 추가 (중복 방지)
    content = re.sub(r'import TopNav from.*\n', '', content)
    
    # use client 다음에 import 추가
    if '"use client";' in content:
        content = content.replace('"use client";', '"use client";\nimport TopNav from "@/components/TopNav";', 1)
    elif "'use client';" in content:
        content = content.replace("'use client';", "'use client';\nimport TopNav from \"@/components/TopNav\";", 1)
    
    # 기존 <TopNav /> 제거
    content = content.replace('<TopNav />', '')
    
    # 첫 번째 return ( 뒤에 TopNav 강제 추가
    # return ( 바로 뒤에 TopNav 넣기
    content = re.sub(r'(return\s*\(\s*\n\s*<div[^>]*>)', r'\1\n      <TopNav />', content, count=1)
    
    # 만약 위 패턴 못 찾으면 <div className="min-h-screen"> 뒤에 추가
    if '<TopNav />' not in content:
        content = re.sub(r'(<div className="min-h-screen[^>]*>)', r'\1\n      <TopNav />', content, count=1)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ {path} 강제 추가 완료!")

print("끝! 이제 wms, platforms에도 메뉴 고정!")
