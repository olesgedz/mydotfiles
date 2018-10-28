syntax on
set number
set incsearch
set hlsearch
colorscheme monokai
set listchars=eol:$,tab:>-,trail:~,extends:>,precedes:<
set list
set mouse=a


python from powerline.vim import setup as powerline_setup
python powerline_setup()
python del powerline_setup



set laststatus=2
