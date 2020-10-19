<template>
  <div>
    <section class="section">
      <div class="container">
              <div>
                <button @click='toggleShow' class='anchor'>Выберите ваш город:</button>
                <div v-if='showMenu' class='menu'>
                  <div class='menu-item' v-bind:key="item" v-for='item in cities.cities' @click='itemClicked(item)'>{{item}}</div>
                </div>
              </div>
              <p>Текущий город пользователя: <span>{{cities.user_city}}</span></p>
<!--              <div class="control">-->
                <a class="button is-large is-primary" @click="save_city">Сохранить</a>
<!--              </div>-->
      </div>

    </section>

  </div>
</template>

<script>
import {  mapState } from 'vuex'
  export default {
    name: 'DropDown',
    data () {
      return {
        showMenu: false,
      }
    },
    methods: {
      toggleShow: function() {
        this.showMenu = !this.showMenu;
      },
      itemClicked: function(item) {
        this.toggleShow();
        this.activeCity = item;
        this.cities.user_city = item;
      },
      save_city () {
        this.$store.dispatch('save_city', { current_city: this.cities.user_city })
      },
    },
    computed: {
      ...mapState({
        cities: state => state.cities,
      }),
    },

    beforeMount () {
      this.$store.dispatch('loadCities')
    },
  }
</script>
<style>
  .anchor {
    display: flex;
		align-items: center;
		justify-content: center;
    border: 1px solid transparent;
    padding: .75rem 2rem;
    font-size: 1rem;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
		color: #fff;
    background-color: #27AE60;
    border-color: #27AE60;
}

.anchor::after {
		display: inline-block;
    width: 0;
    height: 0;
    margin-left: .5em;
    vertical-align: .255em;
    content: "";
    border-top: .3em solid;
    border-right: .28em solid transparent;
    border-bottom: 0;
    border-left: .28em solid transparent;
}

.anchor:hover {
	color: #fff;
	background-color: #229954;
	border-color: #229954;
	cursor: pointer;
}

.menu {
	background-color: #fff;
	background-clip: padding-box;
	border: 1px solid rgba(0,0,0,.15);
	border-radius: .25rem;
	color: #212529;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	font-size: 1rem;
	list-style: none;
	margin: .125rem 0 0;
	padding: .5rem 0;
	position: absolute;
	text-align: left;
}

.menu-item {
	color: #212529;
	padding: .25rem 1.5rem;
	transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.menu-item:hover {
	background-color: #F4F6F6;
	cursor: pointer;
}

span {
	font-weight: bold;
	color: #229954;
	font-size: 1.25rem;
}

</style>