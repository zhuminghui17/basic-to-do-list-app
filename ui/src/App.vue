<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand href="#">To-Do Lists Example</b-navbar-brand>      
    </b-navbar>
    
    <b-container fluid class="my-4">
      <b-row>
        <b-col xs="12" sm="4">
          <b-card no-body class="mb-3">
            <template #header>
              <div class="d-flex justify-content-between align-items-center">
                Lists
                <b-button class="ml-3" size="sm" @click="refreshLists"><b-icon-arrow-clockwise /></b-button>
              </div>
            </template>
            <b-list-group flush>
              <b-list-group-item
                v-for="list, i in lists"
                :key="i"
                class="d-flex justify-content-between align-items-center"
                :class="{ 'font-weight-bold': selectedList?.id === list.id }"
              >
                <span @click="selectList(list.id)" title="list.id">{{ list.name }}</span>
                <b-row>
                  <b-col>
                    <b-badge variant="dark" pill>{{ list.count }}</b-badge>
                  </b-col>
                  <b-button variant="success" size="sm" @click="handleDeleteLists(list.id)">Delete</b-button>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-input-group>
                  <b-form-input v-model="nameOfListToCreate" placeholder="List name" />
                  <b-input-group-append>
                    <b-button @click="handleClickAddList"><b-icon-plus-circle /></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
        <b-col xs="12" sm="8">
          <b-card no-body>
            <template #header>
              <div v-if="selectedList != null" class="d-flex justify-content-between align-items-center">
                {{ selectedList.name }}
                <b-button class="ml-3" size="sm" @click="refreshSelectedList"><b-icon-arrow-clockwise /></b-button>
              </div>
              <div v-else>
                No List Selected
              </div>
            </template>
            <b-list-group flush>
              <b-list-group-item
                v-for="item, i in (selectedList == null ? [] : selectedList.items)"
                :key="i"
                class="d-flex justify-content-between align-items-center"
              >
                <span :title="item.id">
                  <b-form-checkbox class="d-inline-block" @input="checkItem(item.id, $event)" :checked="item.completed" />
                  {{ item.description }}
                </span>
                <b-row>
                  <b-col>
                    <b-badge variant="dark" pill>{{ item.priority }}</b-badge>
                  </b-col>
                  <b-button variant="success" size="sm" @click="handleDeleteItem(selectedList.id,item.id)">Delete</b-button>
                </b-row>
                <b-badge variant="secondary">{{ item.priority }}</b-badge>
                <b-button variant="success" @click="handleDeleteItem">Delete</b-button>
              </b-list-group-item>
              <b-list-group-item v-if="selectedList != null">
                <b-input-group>
                  <b-form-input v-model="descriptionOfItemToAdd" placeholder="Task description" />
                  <b-input-group-append>
                    <b-button @click="handleClickAddItem"><b-icon-plus-circle /></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { TodoItem, TodoList, TodoListBasicInfo, Id, getLists, addList, getList, addItemToList, updateItemOnList, deleteList, deleteItemFromList } from './data'

const lists: Ref<TodoListBasicInfo[]> = ref([])
const nameOfListToCreate = ref("")

const selectedList: Ref<null | TodoList> = ref(null)
const descriptionOfItemToAdd = ref("")

function refreshLists() {
  getLists().then(
      function (value){
        lists.value = value
      }
  )
  if (selectedList.value && !lists.value.find(l => l.id === selectedList.value!.id)) {
    selectedList.value = null
  }
}

onMounted(refreshLists)

function selectList(listId: Id) {
  getList(listId).then((value) => {
    selectedList.value = value
      }
  )
}

function handleClickAddList() {
  addList(nameOfListToCreate.value).then((id) =>{
    nameOfListToCreate.value = ""
    refreshLists()
    selectList(id)}
  )
}

function refreshSelectedList() {
  if (selectedList.value == null) {
    return
  }
  getList(selectedList.value.id).then((value) =>{
    selectedList.value = value
  })
}

function handleClickAddItem() {
  if (selectedList.value == null) {
    return
  }
  addItemToList(
    selectedList.value?.id, 
    {
      description: descriptionOfItemToAdd.value,
      priority: 3,
      completed: false,
    }
  )
  descriptionOfItemToAdd.value = ""
  refreshSelectedList()
  refreshLists()
}

function checkItem(itemId: Id, completed: boolean) {
  updateItemOnList(selectedList.value!.id, itemId, { completed })
  refreshSelectedList()
}

function handleDeleteLists(listId: Id){
  deleteList(listId).then(() =>{
    if (selectedList.value?.id == listId){
      refreshSelectedList()
    }
    refreshLists()}
  )
}

function handleDeleteItem(listId: Id,itemId:Id){
  deleteItemFromList(listId,itemId).then(()=>{
    refreshSelectedList()
  })
}
</script>