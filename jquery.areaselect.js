/*
三级省市联动 by chexingyou 2015.11.13
settings 参数说明
areaData:省市数据，优先级高于url
url:省市数据json文件地址
prov:默认省份
city:默认城市
county:默认地区（县）
*/
(function($){
    $.fn.areaSelect = function(settings){
        settings = $.extend({
            url:null,
            areaData:null,
            prov:null,
            city:null,
            county:null,
            defaultText:['请选择','请选择','请选择']
        },settings);
        if(!(settings.areaData || settings.url)){
           throw new Error("缺少数据源");
        }
        return this.each(function(){
            var $this = $(this);
            new AreaSelect($this,settings);
        })
    }

    function AreaSelect(container,settings){
        var self = this;
        self.container = container;
        self.settings = settings;
        if(self.settings.areaData){
            self.areaData = self.settings.areaData;
            self.init();
        }else{
            $.getJSON(settings.url,function(resp){
                self.areaData = resp;
                self.init();
            })
        }
    }
    AreaSelect.prototype = {
        init: function(){
            var self = this;
            if(!self.areaData){
                throw new Error("缺少数据源");
            }
            var template=['<select class="J_select_prov"></select>',
                '<select class="J_select_city"></select>',
                '<select class="J_select_county"></select>'].join('');
            self.container.html(template);
            self.initProv();
            self.bindEvent();
        },
        initProv: function(){
            var self = this;
            var provs = self.areaData.provinces;
            var $select = self.container.find('.J_select_prov');
            $select.append('<option value="">' + self.settings.defaultText[0] +'</option>')
            for(var i in provs){
                $select.append('<option value="' + i +'">'+ provs[i].name+'</option>');
                if(i == self.settings.prov){
                    $select.val(i);
                }
            }
            self.initCity($select.val());
        },
        initCity: function(prov){
            var self = this;
            var $select = self.container.find('.J_select_city');
            $select.empty();
            $select.append('<option value="">' + self.settings.defaultText[1] +'</option>');
            if(prov) {
                var citys = self.areaData.provinces[prov].citys;
                for(var i in citys){
                    $select.append('<option value="' + i +'">'+ citys[i].name+'</option>');
                    if(i == self.settings.city){
                        $select.val(i);
                    }
                }
            }
            self.initCounty(prov,$select.val());
        },
        initCounty: function(prov,city){
            var self = this;
            var $select = self.container.find('.J_select_county');
            $select.empty();
            $select.append('<option value="">' + self.settings.defaultText[2] +'</option>');
            if(city) {
                var countys = self.areaData.provinces[prov].citys[city].countys;
                for(var i in countys){
                    $select.append('<option value="' + i +'">'+ countys[i].name+'</option>');
                    if(i == self.settings.county){
                        $select.val(i);
                    }
                }
            }
        },
        bindEvent: function(){
            var self = this;
            self.container.find('.J_select_prov').on('change',function(){
                self.initCity($(this).val());
            })
            self.container.find('.J_select_city').on('change',function(){
                self.initCounty(self.container.find('.J_select_prov').val(),$(this).val());
            })
        }
    }
})(jQuery)