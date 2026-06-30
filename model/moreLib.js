const list = ['github星铁','星铁']

const library = {
  星铁: 'StarRail',
  github星铁: 'StarRail',
}

const link = {
  星铁: 'https://gitee.com/mingdiandianzhu/StarRail',
  github星铁: 'https://github.com/jiuyixian/StarRail',
}

function getRepoInfo (input = '') {
  const name = input.trim()
  if (!library[name] || !link[name]) {
    return null
  }

  return {
    repo: link[name],
    dir: library[name]
  }
}

export {
  list,
  library,
  link,
  getRepoInfo
}
