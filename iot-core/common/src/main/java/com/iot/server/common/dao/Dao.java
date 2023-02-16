package com.iot.server.common.dao;


import java.util.List;

public interface Dao<E, ID> {

   List<E> findAll();

   E findById(ID id);

   E save(E entity);

   boolean removeById(ID id);

}
