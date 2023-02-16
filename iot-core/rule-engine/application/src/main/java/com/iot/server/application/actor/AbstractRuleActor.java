package com.iot.server.application.actor;

import akka.actor.typed.Behavior;
import akka.actor.typed.PostStop;
import akka.actor.typed.javadsl.AbstractBehavior;
import akka.actor.typed.javadsl.ActorContext;
import akka.actor.typed.javadsl.Behaviors;
import akka.actor.typed.javadsl.Receive;
import com.iot.server.application.message.ActorMsg;
import com.iot.server.application.message.DeleteActorMsg;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class AbstractRuleActor extends AbstractBehavior<ActorMsg> {

    public AbstractRuleActor(ActorContext<ActorMsg> context) {
        super(context);
    }

    @Override
    public Receive<ActorMsg> createReceive() {
        return newReceiveBuilder()
                .onMessage(ActorMsg.class, this::onMsg)
                .onMessage(DeleteActorMsg.class, this::onGracefulShutdown)
                .onSignal(PostStop.class, signal -> this.onPostStop())
                .build();
    }

    private Behavior<ActorMsg> onMsg(ActorMsg msg) {
        if (!process(msg)) {
            log.warn("Unprocessed message {}", msg);
        }
        return this;
    }

    private Behavior<ActorMsg> onGracefulShutdown(DeleteActorMsg msg) {
        getContext().getSystem().log().info("Initiating graceful shutdown...");

        // Here it can perform graceful stop (possibly asynchronous) and when completed
        if (process(msg)) {
            this.getContext().stop(this.getContext().getSelf());
        }
        // return `Behaviors.stopped()` here or after receiving another message.
        return Behaviors.stopped();
    }

    private Behavior<ActorMsg> onPostStop() {
        getContext().getSystem().log().info("Actor rule node stopped");
        return this;
    }

    protected abstract boolean process(ActorMsg msg);
}
