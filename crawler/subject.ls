require! \fs
require! word-freq-sync: \./wordfreq.worker.js
err,data <- fs.readFile \../nsc-projects.csv {}
json = {}
data = data.toString \utf8
lines = data.split "\n"
for line in lines
  l = line.split '","'
  year = amount = null
  if l[4]?
    year = l[4] - /\/.*$/
  if l[5]?
    amount = l[5]
  subject = l[3]
  if year?
    if !json[year]?
      json[year] = []
  if json[year]?
    json[year].push subject
    #json[year].push {s: subject, v: amount}
options =
  maxiumPhraseLength: 6
  minimumCount: 5
wf = word-freq-sync options
out = {}
for y of json
  c = null
  c = json[y].join "\n"
  console.log y
  list = wf.process c
  console.log '... done'
  if list?
    out[y] = [list]
  wf.empty!

fs.writeFile \subject.json JSON.stringify out
