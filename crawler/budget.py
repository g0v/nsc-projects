#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re, string, json, sys

lines = map(lambda x: x.split(","), open("nsc-projects.csv","r").readlines())[1:]
insthash = {}
for line in lines:
  instpostfix = ["博物院","署","研究院","大學","學院","專科學校","醫院","基金會","委員會","中心"]
  cs = map(lambda x:string.find(line[2],x), instpostfix)
  count = 0
  inst = ""
  for v in cs:
    if v>0:
      inst = line[2][0:v] + instpostfix[count]
      break
    count += 1
  if inst=="": inst = line[2]
  inst = re.sub('"',"",inst.decode("utf-8"))
  dept = re.sub('"',"",line[2].decode("utf-8"))
  dept = re.sub(inst, "", dept)
  dept = re.sub(ur"[（].*?[）]","",dept)
  dept = re.sub(ur"\(.+\)","",dept)
  inst = re.sub(ur"國立|私立|財團法人|臺灣基督長老教會馬偕紀念社會事業基金會","",inst)
  inst = re.sub(ur"科技大學", u"科大", inst)
  inst = re.sub(ur"[（].*?[）]","",inst)
  inst = re.sub(ur"\(.+\)","",inst)
  
  budget = re.sub(r'"',"",line[5])
  insthash.setdefault(inst, [0,{}])
  insthash[inst][0] += int(budget)/1000
  if dept!="":
    insthash[inst][1].setdefault(dept, 0)
    insthash[inst][1][dept] += int(budget)/1000

print(json.dumps(insthash, ensure_ascii=False).encode("utf-8"))
 
