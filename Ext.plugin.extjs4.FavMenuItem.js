Ext.define('Ext.plugin.extjs4.FavMenuItem', {
    extend : 'Ext.AbstractPlugin',
    alias  : 'plugin.favmenuitem',

    /**
     * @cfg {String} favCls
     * Base CSS name for the favorite {@link Ext.core.Element}.
     * Default: 'x-menu-item-favorite'
     */
    favCls      : Ext.baseCSSPrefix + 'menu-item-favorite',
    /**
     * @cfg {Function} handler
     * A function to be called when the favorite {@link Ext.core.Element} is clicked on.
     * Default: Function returning true
     */
    handler     : function(item, plugin, e) { return true; },

    init: function(cmp) {
        var me = this;

        cmp.on('afterrender', me.handleItemRender, me, { single : true });
    },
    handleItemRender: function() {
        var me     = this,
            cmp    = me.cmp,
            marked = me.marked,
            el     = cmp.getEl(),
            text   = el.down('span.' + Ext.baseCSSPrefix + 'menu-item-text'),
            cls    = marked ? Ext.baseCSSPrefix + 'menu-item-favorite-marked' : '',
            fav    = text.insertSibling({
                tag   : 'img',
                src   : Ext.BLANK_IMAGE_URL,
                cls   : Ext.baseCSSPrefix + 'menu-item-favorite ' + cls
            });

        cmp.setWidth(cmp.getWidth() + 20);

        cmp.favEl = fav;

        cmp.mon(fav, {
            scope     : me,
            mousedown : me.handleFavClick
        });
    },

    getFavEl: function() {
        var me  = this,
            cmp = me.cmp;

        return cmp.favEl;
    },

    handleFavClick: function(e, t) {
        var me   = this,
            cmp  = me.cmp,
            el   = Ext.get(t),
            func = me.handler.bind(me.scope || me, cmp, me, e),
            returned;

        if (cmp.isXType('menucheckitem')) {
            cmp.on('beforecheckchange', function() {
                return false;
            }, me, { single : true });
        }

        el.addCls(me.favCls + '-clicked');

        me.cmp.fireEvent('click', cmp, me, e);

        returned = func();

        if (returned === 'wait') {
            return;
        } else if (returned) {
            me.setMarked(!me.marked);
        } else {
            me.cmp.fireEvent('exception', cmp, me, returned, e);
            el.removeCls(me.favCls + '-clicked');
        }
    },

    setMarked: function(marked) {
        var me     = this,
            cmp    = me.cmp,
            el     = cmp.getEl(),
            fav    = me.getFavEl(),
            action = marked ? 'add' : 'remove';

        fav.removeCls(me.favCls + '-clicked');

        fav[action + 'Cls'](me.favCls + '-marked');
        me.marked = marked;
        cmp.fireEvent('mark', cmp, me, marked, fav);

        return fav;
    }
});
