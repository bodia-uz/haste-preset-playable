# Haste preset yoshi

fork of https://github.com/wix-private/wix-haste/tree/master/haste-preset-yoshi

install:
```
npm install git+ssh://git@github.com/bodia-uz/wix-haste-preset-yoshi-video-player.git
```
rebase:
```
git checkout upstream/master
git subtree split --prefix=haste-preset-yoshi --onto upstream-haste-preset-yoshi -b upstream-haste-preset-yoshi
git checkout master
git rebase upstream-haste-preset-yoshi
```
