(function() {
    'use strict';

    //DATA


    var lists = [];

    const saveLS = function(lists) {
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    function loadLS() {
        if (localStorage.getItem('lists')) {
            lists = JSON.parse(localStorage.getItem('lists'))
            populateLists(lists);

        }
    }
    //FUNCTIONS



    const generateItem = function(value, id) {
        const $itemDiv = $('<div>').addClass('item');
        const $li = $('<li>').text(value);
        $itemDiv.attr('id', id);

        $itemDiv.append($li);

        return $itemDiv;
    }

    const createEditForm = function(value) {
        const $container = $('<div>').addClass('edit-container');
        const $editDiv = $('<div>').addClass('edit-form');
        const $textarea = $('<textarea>')
            .attr('autocomplete', 'off')
            .attr('wrap', 'soft')
            .attr('autofocus', null)
            .text(value);
        const $buttonsDiv = $('<div>').addClass('edit-form-btns');
        const $saveBtn = $('<button>')
            .attr('type', 'submit')
            .addClass('btn save-btn')
            .text('Save');
        const $exitBtn = $('<button>').addClass('exit-edit-btn');
        const $exitI = $('<i>').addClass('fa fa-times');

        $exitBtn.append($exitI);
        $buttonsDiv.append($saveBtn);
        $buttonsDiv.append($exitBtn);
        $editDiv.append($textarea);
        $editDiv.append($buttonsDiv);
        $container.append($editDiv);

        return $container;
    };

    const createAddForm = function() {
        const $toolsDiv = $('<div>').addClass('tools');
        const $form = $('<form>');
        const $textarea = $('<textarea>')
            .attr('wrap', 'soft')
            .attr('placeholder', 'Add item')
            .attr('autocomplete', 'off')
            .attr('autofocus', null);
        const $buttonDiv = $('<div>').addClass('add-form-btns');
        const $button = $('<button>')
            .attr('type', 'submit')
            .addClass('btn add-btn')
            .text('Add');
        const $exit = $('<button>').addClass('btn exit-add-btn');
        const $i = $('<i>').addClass('fa fa-times');

        $exit.append($i);
        $buttonDiv.append($button);
        $buttonDiv.append($exit);
        $form.append($textarea);
        $form.append($buttonDiv);
        $toolsDiv.append($form);

        return $toolsDiv;
    }

    const createAddPrompt = function() {
        const $button = $('<button>').addClass('add-item').text('Add an item...');

        return $button;
    }

    const createList = function(list) {
        const $listDiv = $('<div>').addClass('list');
        $listDiv.attr('id', list.id);
        const $headerDiv = $('<div>').addClass('list-header');
        const $h2 = $('<h2>').text(list.title);
        const $delBtn = $('<button>').addClass('btn del-list-btn');
        const $delI = $('<i>').addClass('fa fa-trash');
        const $list = $('<ul>').addClass('connectedSortable');
        $list.sortable({
            receive: function(event, ul) {
                var oldlist = event.target.parentNode;
                console.log(cardId);
                var cardId = ul.item[0].id
                console.log(list.id)
                console.log(cardId)
                let searchtask = lists.map((list) => {
                    return list.tasks
                })
                let allCards = [].concat.apply([], searchtask);
                let cardObj = allCards.find(x => x.id == cardId)
                let parentId = cardObj.parentID
                let updList = lists.map((list) => {
                    if (list.id == oldlist.id) {
                        console.log(list.tasks.length)

                        cardObj.parentID = list.id
                        console.log(cardObj)
                        list.tasks.push(cardObj)
                        return list
                    }
                    if (list.id == parentId) {
                        let removeTask = list.tasks.filter((e) => e.id == cardId);
                        console.log(removeTask)
                        list.tasks = list.tasks.filter((e) => !removeTask.includes(e));
                        console.log(list)
                        return list
                    }


                    return list
                })
                saveLS(lists)
            }

        })
        $list.sortable({
            connectWith: '.connectedSortable'
        }).disableSelection();

        $delBtn.append($delI);
        $headerDiv.append($h2);
        $headerDiv.append($delBtn);
        $listDiv.append($headerDiv);


        for (const item of list.tasks) {
            const $divContainer = generateItem(item.titleTask, item.id);

            $list.append($divContainer);
        }

        $listDiv.append($list);
        $listDiv.append(createAddPrompt());

        return $listDiv;
    }

    const populateLists = function(lists) {
        for (const list of lists) {
            const $list = createList(list);

            $('.all-lists').append($list);
        }
    }



    const deleteItem = function(e) {
        for (var i = 0; i < lists.length; i++) {
            for (var j = 0; j < lists[i].tasks.length; j++) {
                if (this.parentNode.id == lists[i].tasks[j].id) {
                    var searchtask = lists[i].tasks.filter((e) => e.id == this.parentNode.id);
                    lists[i].tasks = lists[i].tasks.filter((e) => !searchtask.includes(e));
                    saveLS(lists)
                }
            }

        }
        $(this).parents('.item').remove();
        console.log(this.parentNode);
    }

    const inHover = function() {
        if ($(this).hasClass('editing')) {
            return;
        }
        const $deleteButton = $('<button>');
        const $delI = $('<i>');
        const $button = $('<button>');
        const $i = $('<i>');

        $deleteButton.addClass('btn del-item-btn');
        $delI.addClass('fa');
        $delI.addClass('fa-trash');
        $deleteButton.append($delI);
        $i.addClass('fa');
        $i.addClass('fa-pencil');
        $button.append($i);
        $button.addClass('btn edit-btn');
        $(this).append($button);
        $(this).append($deleteButton);
    }

    const outHover = function() {
        $('.edit-btn').remove();
        $('.del-item-btn').remove();
    }




    //LISTENERS

    // Create new list
    $('.new-list').on('click', '.list-btn', (e) => {
        e.preventDefault();

        const title = $(e.target).siblings('input').val();
        const list = { title, tasks: [], id: Math.random() };
        lists.push(list)
        saveLS(lists);
        console.log(lists);
        const $newList = createList(list);

        $(e.target).siblings('input').val('');
        $('.all-lists').append($newList);
    });

    // Delete list
    $('.all-lists').on('click', '.del-list-btn', (e) => {
        var list = e.target.parentNode.parentNode.parentNode;
        var searchElem = lists.filter((e) => e.id == list.id);
        lists = lists.filter((e) => !searchElem.includes(e));
        $(e.target).parents('.list').remove();
        saveLS(lists);
        //$(e.target).parents('.list').remove();

    });

    // Delete item on list
    $('.all-lists').on('click', '.del-item-btn', deleteItem);

    // Highlight item and show icon/button on hover
    $('.all-lists').on('mouseenter', '.item', inHover);
    $('.all-lists').on('mouseleave', '.item', outHover);

    // Edit item on list
    $('.all-lists').on('click', '.edit-btn', (e) => {
        const $item = $(e.target).parents('.item');
        const val = $item.children('li').text();
        const $editForm = createEditForm(val);

        $item.children('button').remove();
        $item.append($editForm);
        $item.addClass('editing');
        $item.children('li').remove();
    });

    $('.all-lists').on('click', '.save-btn', (e) => {
        const $item = $(e.target).parents('.item');
        var item = e.target.parentNode.parentNode.parentNode.parentNode;
        let listId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id
        console.log(e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
        const val = $(e.target).parents('.edit-form').children('textarea').val();
        const $li = $('<li>').text(val);
        for (var i = 0; i < lists.length; i++) {
            for (var j = 0; j < lists[i].tasks.length; j++)
                if (item.id == lists[i].tasks[j].id) {
                    var searchtask = lists[i].tasks.filter((e) => e.id == item.id);
                    lists[i].tasks = lists[i].tasks.filter((e) => !searchtask.includes(e));
                    var editTask = { titleTask: val, id: item.id, parentID: listId };
                    console.log(lists[i].tasks)
                    lists[i].tasks.push(editTask);
                    saveLS(lists)


                }
        }

        $item.children().remove();
        $item.removeClass('editing');
        $item.append($li);
    });

    $('.all-lists').on('click', '.exit-edit-btn', (e) => {
        const $item = $(e.target).parents('.item');
        const text = $(e.target).parents('.edit-form').children('textarea').text();
        const $li = $('<li>').text(text);

        $item.children().remove();
        $item.removeClass('editing');
        $item.append($li);
    });


    // Add item to list
    $('.all-lists').on('click', 'button.add-item', (e) => {
        const $list = $(e.target).parents('.list');

        $(e.target).remove();
        $list.append(createAddForm());
    });

    $('.all-lists').on('click', '.add-btn', (e) => {
        e.preventDefault();
        var list = e.target.parentNode.parentNode.parentNode.parentNode;
        const val = $(e.target).parents('.add-form-btns').siblings('textarea').val();
        var task = { titleTask: val, id: Math.random(), parentID: list.id };
        for (var i = 0; i < lists.length; i++) {
            if (list.id == lists[i].id) {
                lists[i].tasks.push(task)
                console.log(lists[i].tasks)
                saveLS(lists)
            }

        }
        const $item = generateItem(val, task.id);

        $(e.target).parents('.list').children('ul').append($item);

        $(e.target).parents('.list').append(createAddPrompt());
        $(e.target).parents('.tools').remove();
    });

    $('.all-lists').on('click', '.exit-add-btn', (e) => {
        e.preventDefault();

        $(e.target).parents('.list').append(createAddPrompt());
        $(e.target).parents('.tools').remove();
    });






    loadLS()



})();